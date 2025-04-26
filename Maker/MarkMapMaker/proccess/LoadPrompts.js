import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export function loadPrompts() {
    try {
        const promptsDir = process.env.PROMPTS_DIR;
        const files = fs.readdirSync(promptsDir);
        const prompts = {};
        files.forEach(file => {
            const filePath = path.join(promptsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const fileName = path.parse(file).name; // Obtiene el nombre del archivo sin la extensión
            prompts[fileName] = fileContent;
        });

        return prompts;
    } catch (error) {
        console.error("Error loading prompts from folder:", error);
        return null;
    }
}


export default loadPrompts;