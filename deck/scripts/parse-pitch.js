import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../../pitch.md');
const outputPath = path.resolve(__dirname, '../src/data/slides.json');

function parsePitch() {
  const markdown = fs.readFileSync(inputPath, 'utf-8');

  // Regex para extraer notas
  const notesRegex = /<!-- notes:\s*([\s\S]*?)\s*-->/g;
  // Regex para extraer triggers
  const triggerRegex = /<!-- trigger:\s*(.*?)\s*-->/g;

  // Split por slide '---'
  const slideBlocks = markdown.split(/\n---\n/);

  const slides = slideBlocks.map((block, slideIndex) => {
    let rawContent = block.trim();
    if (!rawContent) return null;

    let interactionTrigger = undefined;
    let notes = undefined;

    // Extraer trigger
    const triggerMatch = triggerRegex.exec(rawContent);
    if (triggerMatch) {
      interactionTrigger = triggerMatch[1].trim();
      rawContent = rawContent.replace(triggerRegex, '');
    }
    triggerRegex.lastIndex = 0; // reset regex

    // Extraer notas
    const notesMatch = notesRegex.exec(rawContent);
    if (notesMatch) {
      notes = marked.parse(notesMatch[1].trim());
      rawContent = rawContent.replace(notesRegex, '');
    }
    notesRegex.lastIndex = 0; // reset regex

    // Extraer título (primer # Header)
    const titleMatch = rawContent.match(/^#\s+(.*)$/m);
    const title = titleMatch ? titleMatch[1].trim() : `Slide ${slideIndex + 1}`;

    // Separar content y steps con '--' (pasos internos)
    // Nos aseguramos que es '--' solo en una linea (sin '---')
    const parts = rawContent.split(/\n--\n/);
    
    // Convertir markdown a HTML para base content
    const baseContentMarkdown = parts[0].trim();
    // Añadir Tailwind clases básicas al compilar markdown si queremos, pero por ahora lo dejamos estandar.
    // Usamos marked para compilar
    let baseContentHtml = marked.parse(baseContentMarkdown);

    // Ajustar estilos de h1, h2 generados por marked
    baseContentHtml = baseContentHtml.replace(/<h1>/g, '<h1 class="text-4xl font-bold text-brand-primary mb-6">');
    baseContentHtml = baseContentHtml.replace(/<h2>/g, '<h2 class="text-3xl font-semibold mb-4">');
    baseContentHtml = baseContentHtml.replace(/<p>/g, '<p class="text-xl mb-4">');
    baseContentHtml = baseContentHtml.replace(/<strong>/g, '<strong class="font-bold text-brand-secondary">');

    const steps = parts.slice(1).map((stepMarkdown, stepIndex) => {
      let stepHtml = marked.parse(stepMarkdown.trim());
      stepHtml = stepHtml.replace(/<p>/g, '<p class="text-xl mb-4">');
      stepHtml = stepHtml.replace(/<strong>/g, '<strong class="font-bold text-brand-secondary">');
      
      return {
        id: `slide-${slideIndex}-step-${stepIndex}`,
        content: stepHtml
      };
    });

    return {
      id: `slide-${slideIndex}`,
      title,
      content: baseContentHtml,
      ...(steps.length > 0 && { steps }),
      ...(interactionTrigger && { interactionTrigger }),
      ...(notes && { notes })
    };
  }).filter(Boolean);

  fs.writeFileSync(outputPath, JSON.stringify(slides, null, 2), 'utf-8');
  console.log(`[Parser] Procesado ${slides.length} slides de pitch.md -> slides.json`);
}

parsePitch();
