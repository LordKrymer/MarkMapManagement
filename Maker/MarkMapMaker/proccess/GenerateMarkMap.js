import { Transformer, builtInPlugins } from 'markmap-lib';
import { fillTemplate } from 'markmap-render';
import * as fs from 'fs';

async function generateMarkmapHTML(markdownContent, outputPath) {
    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdownContent);
    const assets = transformer.getAssets();
    const html = fillTemplate(root, assets);

    fs.writeFileSync(outputPath, html);
    console.log(`Mapa mental guardado en ${outputPath}`);
}

export default generateMarkmapHTML;