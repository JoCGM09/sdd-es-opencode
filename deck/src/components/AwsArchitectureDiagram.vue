<template>
  <div class="relative w-full h-[500px] bg-background-main border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center overflow-hidden">
    <svg viewBox="0 0 800 500" class="w-full h-full text-text-main" xmlns="http://www.w3.org/2000/svg">
      
      <!-- Definitions for markers and gradients -->
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
        </marker>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9" />
        </linearGradient>
      </defs>

      <!-- 
        Capa 1: Orquestación (EventBridge / Step Functions) 
        Aparece en step >= 0 
      -->
      <g :class="{'opacity-100 translate-y-0': currentStep >= 0, 'opacity-0 -translate-y-4': currentStep < 0}" class="transition-all duration-700 ease-out">
        <rect x="50" y="50" width="180" height="80" rx="8" fill="url(#bgGrad)" stroke="#8B5CF6" stroke-width="2" />
        <text x="140" y="95" text-anchor="middle" fill="#F8FAFC" class="font-bold text-sm">EventBridge + Step Functions</text>
        <text x="140" y="70" text-anchor="middle" fill="#8B5CF6" class="text-xs tracking-widest uppercase">Orquestación</text>
      </g>

      <!-- Conector 1 -> 2 -->
      <path d="M 230 90 L 320 90" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow)" 
            :class="{'opacity-100': currentStep >= 1, 'opacity-0': currentStep < 1}" class="transition-opacity duration-700 delay-300" />

      <!-- 
        Capa 2: Cómputo (Fargate / dbt-ol) 
        Aparece en step >= 1 
      -->
      <g :class="{'opacity-100 scale-100': currentStep >= 1, 'opacity-0 scale-95': currentStep < 1}" class="transition-all duration-700 ease-out">
        <rect x="330" y="50" width="180" height="80" rx="8" fill="url(#bgGrad)" stroke="#3B82F6" stroke-width="2" />
        <text x="420" y="95" text-anchor="middle" fill="#F8FAFC" class="font-bold text-sm">ECS Fargate (dbt-ol)</text>
        <text x="420" y="70" text-anchor="middle" fill="#3B82F6" class="text-xs tracking-widest uppercase">Cómputo</text>
      </g>

      <!-- Conector 2 -> 3 -->
      <path d="M 510 90 L 600 90" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow)" 
            :class="{'opacity-100': currentStep >= 2, 'opacity-0': currentStep < 2}" class="transition-opacity duration-700 delay-300" />

      <!-- 
        Capa 3: Motor y Almacenamiento (Athena / Iceberg / Glue) 
        Aparece en step >= 2 
      -->
      <g :class="{'opacity-100 translate-x-0': currentStep >= 2, 'opacity-0 translate-x-4': currentStep < 2}" class="transition-all duration-700 ease-out">
        <rect x="610" y="50" width="160" height="200" rx="8" fill="url(#bgGrad)" stroke="#10B981" stroke-width="2" />
        <text x="690" y="80" text-anchor="middle" fill="#10B981" class="text-xs tracking-widest uppercase">Motor & Storage</text>
        
        <rect x="630" y="100" width="120" height="40" rx="4" fill="#0D1117" stroke="#3B82F6" stroke-width="1" />
        <text x="690" y="125" text-anchor="middle" fill="#F8FAFC" class="text-xs">Amazon Athena</text>
        
        <rect x="630" y="150" width="120" height="40" rx="4" fill="#0D1117" stroke="#3B82F6" stroke-width="1" />
        <text x="690" y="175" text-anchor="middle" fill="#F8FAFC" class="text-xs">S3 (Iceberg)</text>

        <rect x="630" y="200" width="120" height="40" rx="4" fill="#0D1117" stroke="#3B82F6" stroke-width="1" />
        <text x="690" y="225" text-anchor="middle" fill="#F8FAFC" class="text-xs">Glue Catalog</text>
      </g>

      <!-- Conectores 2 -> 4 (Linaje desde Cómputo) y 3 -> 4 (Catálogo a Linaje) -->
      <path d="M 420 130 L 420 310" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 6" marker-end="url(#arrow)" 
            :class="{'opacity-100': currentStep >= 3, 'opacity-0': currentStep < 3}" class="transition-opacity duration-700 delay-300" />
      
      <path d="M 690 250 L 690 350 L 510 350" stroke="#10B981" stroke-width="2" stroke-dasharray="2 2" marker-end="url(#arrow)" 
            :class="{'opacity-100': currentStep >= 3, 'opacity-0': currentStep < 3}" class="transition-opacity duration-700 delay-500" />

      <!-- 
        Capa 4: Linaje y Gobernanza (DataZone / SageMaker) 
        Aparece en step >= 3 
      -->
      <g :class="{'opacity-100 translate-y-0': currentStep >= 3, 'opacity-0 translate-y-8': currentStep < 3}" class="transition-all duration-700 ease-out">
        <rect x="330" y="310" width="180" height="120" rx="8" fill="url(#bgGrad)" stroke="#EF4444" stroke-width="2" />
        <text x="420" y="340" text-anchor="middle" fill="#EF4444" class="text-xs tracking-widest uppercase">Gobernanza & Linaje</text>
        
        <rect x="350" y="355" width="140" height="30" rx="4" fill="#0D1117" stroke="#EF4444" stroke-width="1" />
        <text x="420" y="375" text-anchor="middle" fill="#F8FAFC" class="text-xs font-semibold">DataZone API</text>
        
        <rect x="350" y="390" width="140" height="30" rx="4" fill="#0D1117" stroke="#EF4444" stroke-width="1" />
        <text x="420" y="410" text-anchor="middle" fill="#F8FAFC" class="text-xs">SageMaker Studio</text>
      </g>
      
    </svg>

    <!-- Indicador textual del paso para guiar en caso de no ver SVG -->
    <div class="absolute bottom-4 right-4 text-xs text-gray-500 font-mono">
      Arquitectura (Step: {{ currentStep + 1 }}/4)
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number;
}>();
</script>

<style scoped>
/* Las transiciones core están manejadas por las clases utilitarias de Tailwind en el markup */
</style>
