# **Automatice el rastreo de linaje de datos en sus pipelines dbt con infraestructura serverless en AWS**

by Maddyzeth Ariza and Oscar Mendoza on 10 SEP 2026 in [Amazon Athena](https://aws.amazon.com/es/blogs/aws-spanish/category/analytics/amazon-athena/ "View all posts in Amazon Athena"), [AWS Fargate](https://aws.amazon.com/es/blogs/aws-spanish/category/compute/aws-fargate/ "View all posts in AWS Fargate"), [AWS Step Functions](https://aws.amazon.com/es/blogs/aws-spanish/category/application-services/aws-step-functions/ "View all posts in AWS Step Functions") [Permalink](https://aws.amazon.com/es/blogs/aws-spanish/automatice-el-rastreo-de-linaje-de-datos-en-sus-pipelines-dbt-con-infraestructura-serverless-en-aws/) [Share](https://aws.amazon.com/es/blogs/aws-spanish/automatice-el-rastreo-de-linaje-de-datos-en-sus-pipelines-dbt-con-infraestructura-serverless-en-aws/#)

*Por Maddyzeth Ariza, Arquitecta de Datos en AWS y Oscar Mendoza, Arquitecto de Soluciones en AWS.*

[++dbt (data build tool)++](https://www.getdbt.com/) es una herramienta de transformación de datos de código abierto ampliamente adoptada por equipos de analytics engineering. Aplica prácticas de ingeniería de software (control de versiones, pruebas automatizadas y documentación como código) a los pipelines de transformación SQL. dbt organiza modelos en un grafo dirigido acíclico (DAG), ejecuta tests de calidad y genera documentación automática, permitiendo que los equipos de datos trabajen de forma modular, auditable y colaborativa.  
Sin embargo, una vez que el proyecto crece a decenas o cientos de modelos, surge una necesidad que dbt por sí solo no resuelve: conectar ese linaje con el catálogo de datos de la organización. Sin linaje claro, sin pruebas de calidad integradas con la gobernanza y sin trazabilidad de extremo a extremo, los equipos de gobernanza, ingeniería y negocio dependen de documentación estática o conocimiento tribal para entender las dependencias entre activos. Este problema se amplifica en la era de la inteligencia artificial, donde los modelos de machine learning y las soluciones de AI generativa solo son tan buenos como los datos que los alimentan.

[++OpenLineage++](https://openlineage.io/) ofrece un estándar abierto para capturar metadatos de linaje en tiempo de ejecución, e incluye un transporte nativo para Amazon DataZone. En este blog, presentamos una arquitectura completamente serverless en AWS que combina estas piezas: ejecuta modelos dbt sobre [++Amazon Athena++](https://docs.aws.amazon.com/athena/), captura el linaje automáticamente con OpenLineage y lo publica a [++Amazon SageMaker Unified Studio++](https://docs.aws.amazon.com/sagemaker-unified-studio/latest/userguide/what-is-sagemaker-unified-studio.html) en cada ejecución, sin componentes intermedios que administrar.

Esto les permite a los equipos de datos desplegar dbt en AWS con mínimo esfuerzo operativo, enfocándose en generar valor de negocio en lugar de administrar servidores.

Un blog anterior, [++Capture data lineage from dbt, Apache Airflow, and Apache Spark with Amazon SageMaker++](https://aws.amazon.com/blogs/big-data/capture-data-lineage-from-dbt-apache-airflow-and-apache-spark-with-amazon-sagemaker/), presenta una alternativa basada en un proxy HTTP (API Gateway + SQS + Lambda) que recibe eventos OpenLineage y los publica en lotes a Amazon DataZone. Ese patrón es ideal cuando se necesita consolidar linaje de múltiples herramientas (dbt, Airflow, Spark) en un único endpoint centralizado; la arquitectura que describimos aquí, en cambio, elimina esos componentes intermedios usando el transporte nativo amazon_datazone_api, lo que reduce la complejidad operativa cuando la fuente de linaje es exclusivamente dbt.

## Descripción general de la arquitectura

La solución se compone de cuatro capas, todas serverless, que trabajan en conjunto para ejecutar transformaciones dbt y capturar linaje de datos de forma automática:

1. **Orquestación** — [++Amazon EventBridge Scheduler++](https://aws.amazon.com/eventbridge/scheduler/) dispara una máquina de estados en [++AWS Step Functions++](https://docs.aws.amazon.com/step-functions/) según un horario cron o rate. Step Functions gestiona reintentos, manejo de errores y notificaciones.
2. **Cómputo** — [++Amazon Elastic Container Service (Amazon ECS) en AWS Fargate++](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) ejecuta un contenedor con dbt-ol (el wrapper de OpenLineage para dbt). Fargate proporciona ejecución serverless de contenedores sin necesidad de gestionar servidores ni clústeres.
3. **Motor de consultas y almacenamiento** — [++Amazon Athena++](https://docs.aws.amazon.com/athena/) ejecuta las consultas SQL que dbt genera. Los modelos se materializan como tablas [++Apache Iceberg++](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html) registradas en [++AWS Glue Data Catalog++](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html), con datos almacenados en [++Amazon Simple Storage Service (Amazon S3)++](https://docs.aws.amazon.com/s3/).
4. **Linaje y gobernanza** — Al finalizar la ejecución, el transporte nativo amazon_datazone_api de la librería openlineage-python envía los eventos de linaje directamente a la API PostLineageEvent de [++Amazon DataZone++](https://docs.aws.amazon.com/datazone/). [++Amazon SageMaker Unified Studio++](https://docs.aws.amazon.com/sagemaker-unified-studio/latest/userguide/what-is-sagemaker-unified-studio.html) correlaciona estos eventos con los activos del catálogo y renderiza el grafo de linaje.

La siguiente figura muestra cómo interactúan estos componentes:



![](https://d2908q01vomqb2.cloudfront.net/4d134bc072212ace2df385dae143139da74ec0ef/2026/07/20/blog-architecture-diagram-1024x509.png)

Esta arquitectura ofrece tres ventajas fundamentales:

- **Cero infraestructura que administrar.** No hay servidores, instancias ni bases de datos de metadatos que mantener. Cada componente escala a cero cuando no está en uso.
- **Linaje automático en cada ejecución.** Cada vez que dbt transforma datos, el linaje se captura y publica sin intervención manual ni pasos adicionales en el pipeline.
- **Costo proporcional al uso.** Fargate cobra por segundo de ejecución, Athena por bytes escaneados (mínimo 10MB por consulta, más costos estándar de S3 y Glue Data Catalog), y la publicación de linaje a Amazon DataZone incluye un free tier de 4,000 API requests y 20 MB de metadata storage por mes. Para pipelines con alta frecuencia de ejecución, consulte la [++*página de pricing de Amazon DataZone*++](https://aws.amazon.com/datazone/pricing/) para estimar costos adicionales.

## Detalles de la solución

### Orquestación y ejecución del pipeline

[++Amazon EventBridge Scheduler++](https://aws.amazon.com/eventbridge/scheduler/) dispara el pipeline según un horario definido (por ejemplo, cada hora o después de una ventana de ingesta). En lugar de conectar el schedule directamente a un contenedor, se utiliza [++AWS Step Functions++](https://docs.aws.amazon.com/step-functions/) como orquestador intermedio. Esto permite aprovechar reintentos con backoff exponencial, manejo de errores y notificaciones sin escribir código adicional.

Step Functions ejecuta una tarea de [++Amazon ECS en AWS Fargate++](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) mediante la [++integración nativa ecs:runTask.sync++](https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html), que espera a que el contenedor finalice antes de evaluar el resultado. Si la ejecución falla, Step Functions puede reintentar automáticamente o enviar una notificación al equipo.

dbt genera artefactos en disco (SQL compilado, manifests, logs) y puede requerir ejecuciones de varios minutos en proyectos grandes. Fargate ofrece un entorno de contenedor completo con sistema de archivos efímero, sin límites de tiempo ni restricciones de almacenamiento temporal. Además, dado que dbt solo envía consultas a Athena (el procesamiento pesado ocurre en el motor de consultas), el contenedor requiere recursos mínimos de CPU y memoria.

### Motor de consultas serverless con Amazon Athena

[++Amazon Athena++](https://docs.aws.amazon.com/athena/) ejecuta las consultas SQL que dbt genera a partir de los modelos. El adaptador [++dbt-athena++](https://docs.getdbt.com/docs/local/connect-data-platform/athena-setup?version=2) traduce las materializaciones de dbt a DDL y DML compatible con Athena, lo que permite a los ingenieros de datos escribir SQL estándar sin preocuparse por la sintaxis específica del motor.

Los modelos se materializan como tablas [++Apache Iceberg++](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html) en [++Amazon S3++](https://docs.aws.amazon.com/s3/), registradas en [++AWS Glue Data Catalog++](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html). Esta combinación ofrece transacciones ACID sobre S3, evolución de esquema sin reescribir datos históricos, y time travel para depuración o auditoría. El registro en Glue Data Catalog es lo que conecta las tablas con el servicio de linaje, ya que SageMaker Unified Studio importa los activos directamente desde el catálogo.

Al usar tablas Iceberg con archivos Parquet (formato columnar) y particionamiento, las consultas solo leen los datos relevantes, lo que optimiza tanto rendimiento como costo.

### Captura y publicación automática de linaje

El componente clave que conecta las transformaciones con la gobernanza es [++OpenLineage++](https://docs.aws.amazon.com/sagemaker-unified-studio/latest/userguide/datazone-data-lineage-what-is-openlineage.html), un estándar abierto para capturar metadatos de linaje. El contenedor ejecuta dbt-ol (el wrapper de OpenLineage para dbt) en lugar de dbt directamente. Esto captura eventos de tipo START, COMPLETE o FAIL por cada modelo ejecutado, incluyendo las relaciones entre tablas de origen y destino.

La librería [++openlineage-python++](https://openlineage.io/docs/client/python/) (disponible desde la versión 1.33.0) incluye un transporte nativo para Amazon DataZone llamado AmazonDataZoneTransport. El transporte utiliza la API de Amazon DataZone porque las capacidades de catálogo y linaje de Amazon SageMaker Unified Studio están construidas sobre Amazon DataZone; por eso la configuración referencia amazon_datazone_api aunque la visualización se realice en SageMaker Unified Studio. Este transporte publica los eventos directamente a la API [++PostLineageEvent++](https://docs.aws.amazon.com/datazone/latest/APIReference/API_PostLineageEvent.html) sin necesidad de componentes intermedios como funciones Lambda, colas o almacenamiento temporal. La configuración se reduce a indicar el tipo de transporte, el ID del dominio y la región. El parámetro `region` que se muestra en el ejemplo está disponible a partir de la versión 1.42.1, por lo que se recomienda usar esa versión o posterior.

Ejemplo:

```yaml
transport:
  type: amazon_datazone_api
  domainId: "<your-domain-id>"
  region: "<your-region>"

```

YAML

La autenticación con la API utiliza [++Signature Version 4 (SigV4)++](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html) a través del rol de tarea de ECS. No se requieren credenciales de larga duración ni llaves de acceso almacenadas en el contenedor.

Es importante considerar que la API [++PostLineageEvent++](https://docs.aws.amazon.com/datazone/latest/APIReference/API_PostLineageEvent.html) admite un tamaño máximo de 300,000 caracteres (~300 KB) por evento de linaje. En proyectos dbt con modelos que involucran muchas tablas de origen o transformaciones con linaje detallado a nivel de columna, un solo evento podría acercarse a este límite. Si esto ocurre, se recomienda segmentar las ejecuciones en grupos más pequeños de modelos para reducir el tamaño individual de cada evento publicado.

### Visualización del linaje en SageMaker Unified Studio

Una vez que los eventos llegan a Amazon DataZone, [++Amazon SageMaker Unified Studio++](https://docs.aws.amazon.com/sagemaker-unified-studio/latest/userguide/what-is-sagemaker-unified-studio.html) los correlaciona con los activos importados desde Glue Data Catalog y renderiza el grafo de linaje. Los usuarios pueden explorar relaciones upstream y downstream de cualquier tabla, y en la mayoría de transformaciones estándar (SELECTs, JOINs, agregaciones), el grafo incluye detalle a nivel de columna.

Para que el linaje se visualice correctamente, las tablas de Glue deben estar importadas como activos en el dominio de SageMaker Unified Studio. Esto se configura una sola vez agregando un data source de tipo AWS Glue al dominio.

El linaje se actualiza automáticamente con cada ejecución del pipeline. Si un ingeniero agrega un nuevo modelo dbt o modifica una transformación existente, el grafo refleja los cambios en la siguiente ejecución sin intervención manual.

### Aislamiento de fallos

La arquitectura separa deliberadamente la ejecución de dbt de la publicación de linaje. Si la API de SageMaker Unified Studio no está disponible al momento de publicar, los modelos de dbt ya se ejecutaron correctamente y la integridad de los datos no se ve afectada. Por otro lado, si dbt falla (un modelo tiene un error SQL o un test no pasa), el pipeline se detiene y no se publican eventos de linaje parciales que confundan el grafo.

Step Functions detecta ambos escenarios y puede notificar al equipo o ejecutar lógica de compensación según la configuración de la máquina de estados.

### Seguridad

La solución sigue el [++principio de mínimo privilegio++](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege). Cada componente asume un [++rol de AWS Identity and Access Management (IAM)++](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) específico con únicamente los permisos que necesita: el contenedor puede ejecutar consultas en Athena, leer y escribir en el catálogo de Glue, acceder a los buckets de S3 correspondientes, y publicar eventos de linaje al dominio específico de DataZone. El orquestador solo puede lanzar tareas de ECS. Todas las credenciales son temporales y rotadas automáticamente por el servicio.

## Conclusión y siguientes pasos

La arquitectura presentada en este blog demuestra que es posible ejecutar pipelines de transformación de datos con dbt en AWS de forma completamente serverless, con linaje automático, gobernanza integrada y costos proporcionales al uso real. Al eliminar la carga operativa de gestionar infraestructura, los equipos de datos pueden dedicar su tiempo a lo que realmente importa: convertir datos en valor de negocio.

Lo invitamos a dar los siguientes pasos:

1. Despliegue esta arquitectura de referencia en su propia cuenta de AWS y adapte los modelos de dbt a sus casos de uso. Los componentes utilizados (Step Functions, ECS Fargate, Athena y S3) escalan desde un proyecto piloto hasta cargas de trabajo empresariales.
2. Explore el ecosistema de analítica y AI de AWS para potenciar los datos que ya está transformando. Servicios como Amazon Quick para visualización, Amazon SageMaker para machine learning y Amazon Bedrock para inteligencia artificial generativa le permiten construir sobre esta base de datos confiable y gobernable para generar predicciones, automatizar decisiones y crear experiencias inteligentes.
3. Conecte su linaje con la gobernanza organizacional a través de Amazon SageMaker Unified Studio, donde equipos de negocio, ingeniería y cumplimiento pueden explorar dependencias entre activos de datos sin depender de documentación estática.

Los datos transformados con calidad y trazabilidad son el punto de partida para cualquier iniciativa de analítica avanzada, machine learning o AI generativa. Esta arquitectura le da esa base sólida; lo que construya sobre ella depende de usted.