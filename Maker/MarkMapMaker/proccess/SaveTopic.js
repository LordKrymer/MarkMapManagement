import * as fs from "node:fs";
async function agregarTema(nuevoTema) {
    try {
        const rutaArchivo =  process.env.TOPICS_DIR; // Asegura que la ruta sea correcta
        const contenidoArchivo = await fs.promises.readFile(rutaArchivo, 'utf-8');
        const datosJSON = JSON.parse(contenidoArchivo);

        if (!datosJSON.temas.includes(nuevoTema)) {
            datosJSON.temas.push(nuevoTema);
            await fs.promises.writeFile(rutaArchivo, JSON.stringify(datosJSON, null, 2), 'utf-8');
            console.log(`Tema "${nuevoTema}" agregado correctamente.`);
        } else {
            console.log(`El tema "${nuevoTema}" ya existe.`);
        }
    } catch (error) {
        console.error('Error al leer o escribir el archivo JSON:', error);
    }
}
export { agregarTema };