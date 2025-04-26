import fs from 'node:fs/promises';
import path from 'node:path';
import logger from "../utility/Logger/logger.js";
import * as dotenv from "dotenv";

async function deleteTopic(alias) {
    dotenv.config();
    const resultsDir = process.env.RESULTS_DIR;
    const topicsDir = process.env.TOPICS_DIR;

    const complementFilePath = path.join(resultsDir, 'Complement', `${alias}_complement.txt`);
    const rawFilePath = path.join(resultsDir, 'Raw', `${alias}.md`);
    const htmlFilePath = path.join(resultsDir, 'HTML', `${alias}.html`);
    const topicsFilePath = topicsDir;

    try {
        // Borrar los archivos
        await fs.unlink(complementFilePath);
        logger.info(`Archivo borrado: ${complementFilePath}`);

        await fs.unlink(rawFilePath);
        logger.info(`Archivo borrado: ${rawFilePath}`);

        await fs.unlink(htmlFilePath);
        logger.info(`Archivo borrado: ${htmlFilePath}`);

        // Leer el contenido del archivo JSON
        const data = await fs.readFile(topicsFilePath, 'utf-8');
        const jsonData = JSON.parse(data);

        // Verificar si existe el atributo "temas" y es un array
        if (jsonData && Array.isArray(jsonData.temas)) {
            const indice = jsonData.temas.indexOf(alias);

            // Borrar el valor del alias si existe en el array "temas"
            if (indice > -1) {
                jsonData.temas.splice(indice, 1);
                // Escribir los cambios de vuelta al archivo JSON
                await fs.writeFile(topicsFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
                console.log(`Valor '${alias}' borrado del array "temas" en ${topicsFilePath}`);
            } else {
                console.log(`El alias '${alias}' no fue encontrado en el array "temas" de ${topicsFilePath}`);
            }
        } else {
            console.warn(`El archivo ${topicsFilePath} no tiene un atributo "temas" que sea un array.`);
        }

        logger.info('Operación completada exitosamente.');

    } catch (error) {
        logger.error('Ocurrió un error:', error);
    }
}

export default deleteTopic