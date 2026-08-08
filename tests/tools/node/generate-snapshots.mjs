import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputsPath = path.resolve(__dirname, './sample-outputs.json');
const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));

// import renderer registry
const renderersIndex = new URL('../ui/renderers/index.js', import.meta.url).href;
const { render: renderByType } = await import(renderersIndex);

const outDir = path.resolve(__dirname, './snapshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const [name, output] of Object.entries(outputs)) {
  try {
    const html = renderByType(output);
    const full = `<!doctype html><html><head><meta charset="utf-8"><title>Snapshot - ${name}</title><link rel="stylesheet" href="../assets/styles/components.css"></head><body><div class="snapshot">${html}</div></body></html>`;
    fs.writeFileSync(path.join(outDir, `${name}.html`), full, 'utf8');
    console.log('Wrote snapshot:', name);
  } catch (err) {
    console.error('Error rendering', name, err);
  }
}

console.log('Snapshots generated in', outDir);
