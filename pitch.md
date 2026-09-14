---
<!-- trigger: poll-apertura -->
# Cuando la IA no sabe de dónde vienen sus datos

<!-- notes:
Buenos días a todos. Antes de empezar, quiero hacerles una pregunta simple, y quiero que la piensen en silencio, no me la respondan todavía.

*[pausa]*

¿Alguno de ustedes tiene, hoy, un agente de IA o un chatbot conectado a sus datos de la empresa? ¿Algo que responda preguntas de negocio, que genere reportes automáticos, que tome decisiones o recomiende acciones basado en las tablas que tienen en su warehouse?

*[pausa, buscar manos o asentimientos]*

Bien. Ahora la segunda pregunta, la que realmente importa: si ese agente les da una respuesta rara — un número que no cuadra, una recomendación que no tiene sentido — ¿cuánto tiempo les tomaría encontrar exactamente qué dato, qué transformación, qué modelo generó ese resultado?

*[pausa larga]*

Para la mayoría de equipos con los que he trabajado, la respuesta honesta es: "no lo sabemos con certeza" o "tardaríamos horas, quizás días". Y ese es exactamente el problema del que les quiero hablar hoy.

Mi nombre es Jose, trabajo en proyectos de datos e infraestructura en la nube — Google Cloud principalmente, aunque hoy les voy a hablar de una arquitectura en AWS porque el patrón que resuelve es universal. Y el tema de hoy es este: **cómo la inteligencia artificial, y en particular los agentes de IA, están exponiendo un problema que llevábamos años ignorando en ingeniería de datos: la falta de linaje.**
-->

---
# ¿Por qué conectar un agente a un Data Warehouse o Data Lake?

--
**Contexto en tiempo real**

--
**Acción, no solo conversación**

--
**Escala**

<!-- notes:
Antes de hablar del dolor, quiero asegurarme de que todos partimos del mismo punto: ¿por qué querríamos conectar un agente de IA directamente a un data warehouse o a un data lake, en primer lugar?

Un modelo de lenguaje, por sí solo —el motor detrás de un agente— no sabe nada de su empresa. Sabe lenguaje, sabe patrones generales del mundo, pero no sabe cuántas unidades vendieron ayer en la región norte, ni qué cliente está a punto de cancelar su contrato. Esa información vive en un solo lugar: sus sistemas de datos.

Aquí es donde entran dos términos que quiero dejar claros con una analogía simple.

Un **data warehouse** es como una bodega organizada: los datos ya llegaron limpios, estructurados, en tablas con un propósito claro — ventas, inventario, finanzas. Todo tiene su estante, su etiqueta.

Un **data lake** es más como un almacén general: guarda datos en su forma más cruda, estructurados o no —logs, imágenes, archivos JSON, texto libre— con más flexibilidad, pero también con más trabajo para encontrar exactamente lo que se necesita.

¿Por qué conectar un agente ahí, y no simplemente dejarlo responder con lo que ya "sabe" de su entrenamiento? Por tres razones prácticas:

**Primero: contexto en tiempo real.** El entrenamiento de un modelo tiene una fecha de corte. Sus datos de negocio cambian todos los días. Si el agente no está conectado a su warehouse o su lake, está respondiendo con información vieja o, peor, inventando una respuesta que suena razonable pero no tiene ninguna base real — lo que en la industria llamamos una "alucinación".

**Segundo: acción, no solo conversación.** Un agente conectado no solo responde preguntas — puede ejecutar consultas, generar reportes, y en arquitecturas más avanzadas, disparar acciones: crear una orden, actualizar un registro, enviar una alerta. Esa es la diferencia entre un chatbot que conversa y un agente que efectivamente hace trabajo.

**Tercero: escala.** Ningún humano puede leer diez millones de filas de transacciones y encontrar el patrón anómalo en segundos. Un agente conectado a un warehouse o un lake sí puede — con la consulta correcta, en el momento correcto.

Entonces sí, conectar agentes a nuestros datos es exactamente lo que deberíamos estar haciendo. **El problema no es la conexión en sí — el problema es que la mayoría de organizaciones la está haciendo sin haber resuelto primero la trazabilidad de lo que hay del otro lado de esa conexión.** Y ahí es donde empieza el dolor real del que les quiero hablar.
-->

---
<!-- trigger: poll-pulso -->
# El Dolor: Por qué la IA cambió las reglas del juego

--
**1. Velocidad**

--
**2. Cascada**

--
**3. Opacidad**

<!-- notes:
Durante años, cuando un dashboard mostraba un número mal, el proceso era molesto pero manejable: alguien —humano, con contexto, con memoria del proyecto— abría el código SQL, seguía el hilo hacia atrás, y en algún momento encontraba el problema. Lento, sí. Pero manejable, porque había un humano en el medio que entendía el negocio y podía cuestionar el resultado antes de actuar sobre él.

Con la IA generativa y, sobre todo, con los agentes autónomos, ese humano en el medio está desapareciendo.

Déjenme darles un ejemplo concreto, el tipo de escenario que ya está pasando en empresas reales, no en un futuro hipotético.

Imaginen un agente de IA conectado al catálogo de datos de una empresa de retail — exactamente el tipo de conexión de la que acabamos de hablar. Su trabajo es responder preguntas de negocio y, cuando se le pide, ejecutar acciones: generar una orden de reposición de inventario, ajustar un precio, enviar una alerta a un proveedor. Un día, alguien le pregunta: *"¿qué productos están por agotarse en la región norte?"* El agente consulta una tabla, genera una lista, y —porque tiene permisos para actuar— dispara automáticamente órdenes de compra a los proveedores.

El problema: esa tabla que consultó estaba mal. No por un error de sistema dramático, sino por algo mucho más mundano y mucho más común: un modelo de transformación upstream, tres pasos atrás en la cadena, tenía un filtro mal puesto desde hace dos semanas, y nadie lo notó porque el dashboard que consumía esos datos "se veía razonable".

Antes, ese error se hubiera quedado como un dashboard ligeramente equivocado que alguien eventualmente cuestiona. Ahora, se convirtió en órdenes de compra reales, dinero real, proveedores reales contactados, en cuestión de segundos, sin que ningún humano lo revisara antes.

*[pausa, dejar que aterrice]*

Este es el corazón del problema que quiero que se lleven de esta charla: **un agente de IA es tan bueno como los datos que lo alimentan — pero además, a diferencia de un humano, un agente no duda.** No dice "esto se ve raro, mejor pregunto". Ejecuta. Y ejecuta rápido, y a veces ejecuta en cascada, un agente llamando a otro agente, una decisión alimentando la siguiente.

Esto tiene un nombre en la literatura de gobernanza de IA: es el problema de la **confianza sin trazabilidad**. Le estamos dando autonomía a sistemas que toman decisiones, pero no les hemos dado —ni a ellos, ni a los humanos que los supervisan— una forma de responder rápidamente a la pregunta más básica: *¿de dónde salió este dato, y en qué se convirtió en el camino?*

Y quiero ser específico sobre por qué esto no es solo "más de lo mismo, pero con IA". Hay tres razones por las que el problema se agudiza específicamente ahora:

**Primero: velocidad.** Un humano investigando un dato raro tarda horas. Un agente tomando una decisión mal informada tarda milisegundos. La ventana para atrapar el error antes de que cause daño real se redujo de días a, literalmente, nada — a menos que la trazabilidad esté automatizada también.

**Segundo: cascada.** Cada vez más, no tenemos un agente, tenemos sistemas multiagente: un agente de análisis le pasa un resultado a un agente de decisión, que le pasa una acción a un agente de ejecución. Si el dato de entrada está contaminado, ese error no se queda en un solo lugar — se propaga por toda la cadena de agentes, y cada salto hace más difícil rastrear el origen.

**Tercero: opacidad.** Cuando un agente basado en un modelo de lenguaje genera una respuesta, esa respuesta suena segura. Suena bien redactada, suena confiada. Eso es precisamente lo peligroso: la fluidez del lenguaje no tiene ninguna relación con la calidad del dato subyacente. Un agente puede estar completamente seguro y completamente equivocado, y nada en su forma de comunicarse te lo va a advertir.

*[pausa]*

Entonces la pregunta que toda organización que está adoptando IA debería estar haciéndose no es "¿qué modelo usamos?" o "¿qué framework de agentes elegimos?". La pregunta debería ser: **"si algo sale mal, ¿podemos rastrear en segundos qué dato lo causó, y podemos demostrar qué otros sistemas downstream fueron afectados?"**

Para la mayoría de empresas hoy, la respuesta sigue siendo no. Y eso es exactamente el vacío que quiero mostrarles cómo cerrar.
-->

---
# Los Conceptos Fundamentales

--
**1. dbt (data build tool)**

--
**2. Modelos dbt vs Modelos de IA**

--
**3. Catálogo de Datos**

--
**4. Linaje de Datos**

--
**5. OpenLineage**

<!-- notes:
Antes de llegar a la solución técnica, necesitamos un vocabulario común. Voy a explicar cinco conceptos, cada uno con una analogía simple, porque quiero que todos en esta sala —sean ingenieros de datos o no— se vayan entendiendo exactamente de qué estamos hablando.

**Concepto uno: dbt, data build tool.**

Si no lo conocen: dbt es una herramienta que le aplica prácticas de ingeniería de software a las transformaciones SQL. Control de versiones, pruebas automatizadas, documentación como código.

La analogía que uso: **dbt es como un ingeniero de software, pero para SQL.** En vez de escribir consultas sueltas y desconectadas, dbt organiza tus transformaciones en un grafo — técnicamente se llama DAG, "grafo dirigido acíclico" — que no es más que un mapa que dice: "esta tabla depende de esta otra, que a su vez depende de esta otra".

**Concepto nuevo, dos: ¿qué es exactamente un "modelo"?**

Acabo de usar la palabra "modelo" y quiero detenerme aquí, porque es una palabra que en esta charla van a escuchar con dos significados distintos, y no quiero que se confundan.

Cuando alguien habla de un "modelo de IA" o un "modelo de lenguaje", se refiere al cerebro estadístico detrás de un agente — el sistema entrenado que genera texto o decisiones.

Pero cuando hablamos de dbt, un **modelo** significa algo completamente distinto y mucho más simple: **un modelo es, literalmente, un archivo con una consulta SQL de tipo SELECT, guardado en un archivo** `.sql`**, que define cómo se construye una tabla o una vista a partir de otras.**

La analogía que uso: **piensen en un modelo dbt como una receta de cocina escrita.** La receta dice "toma estos ingredientes —estas tablas de origen— y combínalos de esta manera —este SQL— para obtener este platillo final —una tabla nueva—". Un proyecto dbt con ciento cincuenta modelos es, ni más ni menos, ciento cincuenta recetas conectadas entre sí: el resultado de una receta se convierte en el ingrediente de la siguiente.

Por qué esto importa para el resto de la charla: cuando yo diga "linaje a nivel de modelo" o "qué modelo se modificó", me refiero exactamente a esto — a esa receta SQL específica, guardada, versionada, con nombre propio — no al modelo de IA que mencionamos antes. Son dos mundos que se van a encontrar más adelante en esta charla, pero que empiezan como conceptos completamente separados.

Con esa aclaración hecha, volvemos al mapa de dependencias de dbt: ese DAG del que hablaba —el mapa de qué receta depende de cuál otra— es poderoso. Pero noten la frase clave: dbt sabe cómo se conectan sus propias recetas. No sabe cómo esas recetas se conectan con el resto de la organización — con otras herramientas, con el catálogo general de datos, con los agentes de IA que van a consumir esa información después.

**Concepto tres: el catálogo de datos.**

La analogía: **el catálogo es el índice de una biblioteca gigante.** No contiene los libros —los datos en sí—, pero te dice exactamente dónde está cada uno, quién lo escribió, de qué trata, cuándo se actualizó por última vez.

Sin catálogo, cada equipo tiene su propio Excel, su propia carpeta, su propia memoria de "ah sí, esa tabla la hizo fulano hace dos años". Con catálogo, hay una fuente única de verdad: cualquier persona, o cualquier agente de IA, puede preguntar "¿qué es esta tabla?" y obtener una respuesta confiable.

Y aquí quiero que noten algo importante para el tema de hoy: **los agentes de IA modernos usan el catálogo de datos como su mapa de navegación.** Cuando le conectas un agente a tus datos —recordando el bloque anterior, a tu warehouse o tu lake— ese agente no "sabe" tu negocio de forma innata: lee el catálogo, lee las descripciones, entiende qué tabla usar para qué pregunta. Si el catálogo está incompleto o desactualizado, el agente literalmente está navegando con un mapa equivocado.

**Concepto cuatro: linaje de datos, data lineage.**

La analogía: **es el árbol genealógico de un dato.** De qué tabla nació, qué transformaciones sufrió en el camino —qué "recetas" se le aplicaron—, y en qué tablas "tuvo hijos" — es decir, qué se construyó a partir de él, downstream.

Aquí está la conexión directa con el problema del agente que les conté al inicio: si ese dashboard mal calculado hubiera tenido linaje visible, alguien —o algo, un sistema de monitoreo automático— hubiera podido preguntar en segundos: *"¿qué modelos alimentan esta tabla, y cuándo fue la última vez que se modificaron?"* Y hubiera encontrado el filtro mal puesto en minutos, no en dos semanas.

El linaje no es documentación bonita. Es la diferencia entre un incidente que se resuelve en cinco minutos y uno que se resuelve —si es que se resuelve— después de que ya causó daño.

**Concepto cinco: OpenLineage.**

Última pieza. Si dbt tiene su propio mapa de dependencias entre modelos, y el catálogo necesita saber de ese mapa, ¿cómo se comunican? Ahí entra OpenLineage.

La analogía: **OpenLineage es un idioma común.** Sin él, cada herramienta —dbt, Airflow, Spark, lo que sea— hablaría su propio dialecto de linaje, y cada catálogo tendría que aprender a traducir de cada uno por separado, uno por uno. Con OpenLineage, todas las herramientas hablan el mismo idioma, y cualquier catálogo que entienda ese idioma puede recibir la información automáticamente.

Es un estándar abierto, no un producto de un vendor específico. Eso importa: significa que no están atados a una sola nube, un solo proveedor.

*[pausa, resumen del bloque, decirlo despacio y con énfasis]*

Entonces, resumiendo estas cinco piezas en una sola frase: **dbt organiza sus modelos —sus recetas SQL— en un mapa de dependencias, el catálogo organiza todos los datos de la organización, el linaje conecta ambos mundos mostrando el camino completo, y OpenLineage es el traductor que hace esa conexión automática en vez de manual.**

¿Por qué les importa esto en el contexto de IA y agentes? Porque un agente de IA, cuando responde una pregunta o toma una decisión, está parado sobre estas capas sin que ustedes lo vean. Si cualquiera de esas capas está rota o desconectada, el agente hereda ese problema — y lo hereda en silencio, sin avisarles.
-->

---
# El Costo Real de No Tener Esto

--
**1. Respuestas seguras pero equivocadas**

--
**2. Imposibilidad de auditoría en compliance**

--
**3. Pérdida de confianza organizacional**

<!-- notes:
Quiero darles números y escenarios concretos antes de pasar a la solución, porque quiero que esto no se sienta abstracto.

Escenario uno, el que ya mencioné pero ahora con más detalle: un equipo con, digamos, ciento cincuenta modelos dbt. La documentación vive en Confluence, y como toda documentación manual, está desactualizada seis meses después de escrita. Alguien conecta un agente de IA a este entorno para que responda preguntas de negocio. El agente hace lo que puede: lee las tablas, lee lo que encuentra de metadata, y responde con seguridad — pero esa seguridad está construida sobre información parcial.

Ahora, cuando alguien en el equipo de negocio pregunta "¿por qué el agente me dio esta respuesta?", nadie puede reconstruir el camino completo. No porque el agente esté "mal entrenado" — porque **el problema nunca estuvo en el modelo de IA. Estuvo en la base de datos que el modelo consultó.**

Escenario dos, más regulatorio: piensen en industrias con compliance estricto — salud, energía, sector público. Si un agente de IA toma una decisión, o genera un reporte que se usa para una auditoría, alguien eventualmente va a preguntar: *"demuéstrame de dónde vino este dato, paso por paso."* Sin linaje automatizado, esa demostración es un proyecto de investigación manual de varios días. Con linaje automatizado, es una consulta de treinta segundos en un catálogo.

Y el tercer costo, el más silencioso de todos: **la confianza organizacional.** Cuando un agente de IA se equivoca una vez y nadie puede explicar por qué, la reacción natural del negocio no es "arreglemos la causa raíz" — es "dejemos de confiar en el agente". Y eso mata la adopción de IA en la organización, no porque la tecnología no sirva, sino porque nunca construyeron la base de confianza que la tecnología necesitaba para funcionar bien.

*[pausa]*

Esto me lleva al punto central de la charla: **antes de invertir en más agentes, más modelos, más casos de uso de IA generativa, la pregunta que toda organización debería resolver primero es: ¿tenemos trazabilidad automática de nuestros datos?** Porque sin eso, cada agente nuevo que conectan es un riesgo nuevo que no pueden auditar.

Ahora sí, vamos a la parte práctica: cómo se resuelve esto, con una arquitectura real, completamente automatizada, que no depende de que un humano actualice documentación a mano.
-->

---
# Arquitectura Serverless en AWS

<AwsArchitectureDiagram />

<!-- notes:
Lo que les voy a mostrar es una arquitectura de referencia publicada por el equipo de AWS, que resuelve exactamente el problema que acabamos de describir: capturar el linaje de las transformaciones dbt de forma automática, sin intervención manual, y conectarlo directamente con el catálogo de datos de la organización.

La idea central, antes de entrar en los servicios: **queremos que cada vez que dbt transforme datos, el linaje se capture y se publique solo — sin que nadie tenga que acordarse de documentar nada.**

La arquitectura tiene cuatro capas. Se las voy a explicar con una metáfora de línea de producción, y después les doy el detalle técnico de cada una.

**Piensen en una fábrica.** Necesitan: alguien que decida cuándo arranca la producción, un obrero que haga el trabajo, una máquina que procese el material, y un inspector de calidad que registre todo lo que pasó, para que cualquiera pueda auditar después.

**Capa uno: orquestación.** El "reloj y el capataz" de la fábrica. Amazon EventBridge Scheduler dispara el proceso según un horario — cada hora, después de una ventana de carga de datos, lo que necesiten. Pero en vez de conectar ese horario directamente a la ejecución, se usa AWS Step Functions como orquestador intermedio. ¿Por qué? Porque Step Functions maneja reintentos automáticos con backoff exponencial, maneja errores, y puede notificar al equipo si algo falla — todo esto sin que ustedes tengan que escribir código adicional para manejarlo.

**Capa dos: cómputo.** El "obrero" de la fábrica. Amazon ECS sobre AWS Fargate ejecuta un contenedor. Y aquí está el detalle importante: ese contenedor no corre dbt directamente — corre **dbt-ol**, que es el wrapper de OpenLineage para dbt. Es decir, ejecuta las mismas transformaciones de siempre —las mismas "recetas"— pero además, en cada paso, genera eventos de linaje: cuándo empezó un modelo, cuándo terminó, si falló, y qué tablas de origen se conectaron con qué tablas de destino.

Fargate es serverless — no hay servidores que administrar, no hay clústeres que mantener, y como dbt solo envía consultas al motor de base de datos, el contenedor en sí necesita recursos mínimos.

**Capa tres: motor de consultas y almacenamiento.** Aquí es donde realmente vive el dato — el data warehouse o data lake del que hablábamos al inicio de la charla. Amazon Athena ejecuta las consultas SQL que dbt genera — usando el adaptador dbt-athena, que traduce las materializaciones de dbt a la sintaxis específica de Athena, así que los ingenieros siguen escribiendo SQL estándar sin preocuparse de detalles de motor.

Los modelos se guardan como tablas Apache Iceberg en Amazon S3, registradas en AWS Glue Data Catalog. Iceberg les da algo importante: transacciones ACID sobre S3, evolución de esquema sin tener que reescribir datos históricos, y "time travel" — la capacidad de consultar cómo se veía una tabla en un momento específico del pasado, algo extremadamente útil cuando están investigando un incidente.

Y este es el punto de conexión clave: **el registro en Glue Data Catalog es lo que conecta las tablas con el servicio de linaje.** El catálogo no es un accesorio — es la pieza que hace posible que todo lo demás se entienda entre sí.

**Capa cuatro: linaje y gobernanza.** Aquí está, en mi opinión, la parte más elegante de toda la arquitectura, y quiero que le presten atención especial.

En arquitecturas anteriores de captura de linaje, para conectar una herramienta como dbt con un catálogo de gobernanza, ustedes necesitaban un proxy intermedio: un API Gateway recibiendo eventos, una cola SQS almacenándolos temporalmente, una función Lambda procesándolos y reenviándolos por lotes. Tres piezas adicionales que alguien tiene que mantener, monitorear, y pagar.

Esta arquitectura elimina todo eso. La librería openlineage-python incluye un transporte nativo llamado **AmazonDataZoneTransport**, que publica los eventos de linaje **directamente** a la API PostLineageEvent de Amazon DataZone. Sin Lambda, sin colas, sin almacenamiento temporal. Un salto, directo.

La configuración, honestamente, es de apenas tres líneas:

```yaml
transport:
  type: amazon_datazone_api
  domainId: "<su-domain-id>"
  region: "<su-region>"
```

Eso es todo lo que hay que configurar. Y la autenticación usa SigV4 a través del rol de la tarea de ECS — es decir, no hay llaves de acceso guardadas en el contenedor, no hay credenciales de larga duración que alguien pueda filtrar por accidente.

Una vez que los eventos llegan a Amazon DataZone, **Amazon SageMaker Unified Studio** los correlaciona con los activos que ya están importados del catálogo de Glue, y dibuja el grafo de linaje. Y aquí está el dato que conecta todo de vuelta con el problema de los agentes: en la mayoría de transformaciones estándar —selects, joins, agregaciones— este grafo llega con **detalle a nivel de columna**. No solo "esta tabla depende de esta otra tabla" — sino "esta columna específica depende de estas otras tres columnas específicas, a través de esta transformación específica".

Piensen en lo que eso significa para el escenario del agente de IA que les conté al inicio. Si el agente toma una decisión mal informada por una columna específica, con este nivel de detalle, un ingeniero puede llegar directamente a la causa raíz en segundos, no en días.

Quiero destacar tres ventajas de esta arquitectura, porque las considero el resumen ejecutivo si alguien en la sala solo se lleva tres ideas de esta parte:

**Primero: cero infraestructura que administrar.** No hay servidores, no hay instancias, no hay bases de datos de metadata que mantener. Cada componente escala a cero cuando no está en uso — literalmente no pagan nada si el pipeline no está corriendo.

**Segundo: linaje automático en cada ejecución.** Cada vez que dbt transforma datos, el linaje se captura y se publica sin que nadie tenga que acordarse de nada, sin pasos manuales adicionales en el pipeline.

**Tercero: costo proporcional al uso real.** Fargate cobra por segundo de ejecución. Athena cobra por bytes escaneados. Y la publicación de linaje a Amazon DataZone incluye una capa gratuita de cuatro mil llamadas de API y veinte megabytes de almacenamiento de metadata al mes — que para la mayoría de proyectos medianos, cubre bastante terreno antes de empezar a generar costo adicional.

Dos detalles más que quiero mencionar porque hablan directamente de robustez operacional:

**Aislamiento de fallos:** la arquitectura separa deliberadamente la ejecución de dbt de la publicación de linaje. Si el servicio de linaje no está disponible en el momento de publicar, los datos ya se transformaron correctamente — la integridad del pipeline no se ve afectada. Y si dbt falla, el pipeline se detiene y no se publican eventos de linaje parciales que después confundirían el grafo con información incompleta.

**Seguridad con mínimo privilegio:** cada componente tiene exactamente los permisos que necesita, ni uno más. El contenedor puede ejecutar consultas en Athena, leer y escribir en el catálogo, y publicar eventos al dominio específico de linaje. El orquestador solo puede lanzar tareas — no puede tocar datos directamente. Todas las credenciales son temporales y rotan automáticamente.
-->

---
# Cerrando el Círculo: De vuelta a la IA

<!-- notes:
Ahora quiero que volvamos al inicio de la charla, al agente que disparó órdenes de compra basado en un dato mal calculado.

Con esta arquitectura funcionando, ese mismo escenario se ve completamente distinto. El filtro mal puesto en el modelo upstream — el que tardó dos semanas en detectarse en el escenario original — ahora es visible en el grafo de linaje desde la primera ejecución después del error. Un ingeniero, o incluso un sistema de monitoreo automatizado, puede preguntar: *"¿qué modelos se modificaron en las últimas veinticuatro horas que alimentan esta tabla?"* y obtener la respuesta en segundos.

Y aquí quiero plantear algo que va un paso más allá de lo que dice el blog original de AWS, pero que se desprende naturalmente de la arquitectura: **un catálogo con linaje automático no es solo una herramienta para que los humanos investiguen incidentes después de que pasaron. Es la base sobre la que se puede construir gobernanza proactiva para agentes de IA.**

Piensen en esto: si un agente de IA, antes de actuar sobre un dato, pudiera consultar automáticamente "¿este dato viene de una fuente con linaje completo y verificado, o de una fuente parcial?", ese agente podría ajustar su nivel de confianza en la respuesta. Podría decir "tengo alta confianza en esto" o "esto viene de una tabla que no se ha actualizado en dos semanas, recomiendo verificación humana antes de actuar". Eso no es ciencia ficción — es exactamente el tipo de contexto que un catálogo con linaje automático puede exponer, vía API, a cualquier sistema que lo consuma, incluyendo agentes.

La arquitectura que les mostré no fue diseñada pensando específicamente en agentes de IA — fue diseñada para resolver gobernanza de datos en general. Pero es, casi accidentalmente, exactamente la infraestructura que la era de los agentes necesita. Porque al final, la pregunta que un compliance officer le hace a un equipo de datos, y la pregunta que un agente de IA debería poder hacerse a sí mismo antes de actuar, son la misma pregunta: *"¿de dónde viene esto, y puedo confiar en ello?"*
-->

---
<!-- trigger: poll-cierre -->
# Cierre y Llamado a la Acción

--
**1. Piloto pequeño**

--
**2. Auditar trazabilidad antes de sumar agentes**

--
**3. Conectar linaje con gobernanza**

<!-- notes:
Quiero dejarles tres pasos concretos, para llevarse de esta charla más allá de la teoría.

**Primero: empiecen con un piloto pequeño.** No necesitan migrar todos sus modelos dbt de una vez. Los mismos componentes —Step Functions, Fargate, Athena, S3— escalan desde un proyecto piloto de diez modelos hasta cargas de trabajo empresariales de cientos. Empiecen con los modelos que alimentan sus casos de uso de IA más críticos — ahí es donde el retorno de esta inversión se siente primero.

**Segundo: antes de sumar el próximo agente de IA a su stack, audite la trazabilidad de los datos que ese agente va a consumir.** Háganse la pregunta que planteé al inicio: si algo sale mal, ¿cuánto tiempo les tomaría encontrar la causa? Si la respuesta es "horas" o "no estamos seguros", ese es el problema a resolver primero — antes del siguiente caso de uso de IA generativa.

**Tercero: conecten el linaje con la gobernanza organizacional de forma que cualquiera pueda explorarlo** — no solo el equipo de ingeniería. Cuando negocio, cumplimiento e ingeniería pueden ver las mismas dependencias, sin depender de documentación estática que nadie actualiza, la conversación sobre confianza en los datos cambia por completo.

Para cerrar, quiero dejarles la idea central de toda esta charla, en una sola frase:

**La inteligencia artificial no creó el problema de la falta de linaje — pero sí eliminó nuestro margen de error para ignorarlo.** Durante años pudimos vivir con documentación desactualizada porque siempre había un humano revisando antes de actuar. Esa red de seguridad ya no está garantizada. Y la buena noticia es que la solución no requiere reinventar nada — requiere conectar, de forma automática, las piezas que probablemente ya tienen: dbt, un catálogo de datos, y un estándar abierto que ya existe para unirlos.

Muchas gracias. Quedo abierto a preguntas.
-->
