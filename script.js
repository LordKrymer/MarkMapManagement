

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const isSnapshot = getQueryParam('snapshot') === 'true';

if (isSnapshot) {
    console.log('Modo snapshot: omitiendo la inicialización dinámica del mapa.');
    // Puedes incluso detener la ejecución de más código aquí si es necesario:
    // return;
} else {
    console.log('No es modo snapshot: procediendo con la inicialización del mapa.');

document.addEventListener('DOMContentLoaded', function() {
    const selector = document.getElementById('selector');
    const visorHtml = document.getElementById('visor-html');
    const textoComplementarioDiv = document.getElementById('texto-complementario');
    const generarSnapshotBtn = document.getElementById('generar-snapshot');

    // Función para generar las opciones del menú desplegable desde el JSON
    function generarOpcionesDesdeJSON() {
        fetch('Maker/MarkMapMaker/Results/temasTratados.json')
            .then(response => response.json())
            .then(data => {
                data.temas.forEach(tematica => {
                    const opcion = document.createElement('option');
                    opcion.value = tematica;
                    opcion.textContent = tematica.replace(/_/g, ' ');
                    selector.appendChild(opcion);
                });
                // Cargar el primer elemento por defecto después de generar las opciones
                if (data.temas.length > 0) {
                    cargarContenido(data.temas[0]);
                }
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
                selector.innerHTML = '<option>Error al cargar los temas</option>';
            });
    }

    // Función para cargar el HTML en el iframe y el texto complementario (sin cambios)
    function cargarContenido(tematica) {
        visorHtml.src = `Maker/MarkMapMaker/Results/HTML/${tematica}.html`;
        fetch(`Maker/MarkMapMaker/Results/Complement/${tematica}_complement.txt`)
            .then(response => response.text())
            .then(textoMarkdown => {
                // Aquí realizamos el post-procesamiento interpretando el Markdown
                const textoHTML = marked.parse(textoMarkdown);
                textoComplementarioDiv.innerHTML = textoHTML; // Usamos innerHTML para renderizar el HTML generado
            })
            .catch(error => {
                textoComplementarioDiv.textContent = 'No se pudo cargar el texto complementario.';
                console.error('Error al cargar el texto complementario:', error);
            });
    }

    // Evento al cambiar la selección del menú (sin cambios)
    selector.addEventListener('change', function() {
        const tematicaSeleccionada = this.value;
        cargarContenido(tematicaSeleccionada);
    });

    // Generar las opciones iniciales del menú desde el JSON
    generarOpcionesDesdeJSON();



    generarSnapshotBtn.addEventListener('click', () => {
        const iframe = document.getElementById('visor-html');
        const complementContent = textoComplementarioDiv.innerHTML;
        const temaSeleccionado = document.getElementById('selector').value.replace(/_/g, ' ');

        let iframeContentSnapshot = '';
        if (iframe && iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.documentElement) {
            const iframeDocument = iframe.contentWindow.document;
            let clone = iframeDocument.querySelectorAll("svg")[0].querySelectorAll("g")[0].cloneNode(true); // Clonamos el primer grupo de SVG
            iframeDocument.querySelectorAll("svg")[0].querySelectorAll("g")[0].remove(); // Eliminamos el elemento original para generar las condciones deseadas
            iframeContentSnapshot = iframeDocument.documentElement.outerHTML; // Obtenemos el HTML del iframe sin el g
            iframeDocument.querySelectorAll("svg")[0].prepend(clone); // Agregamos el clon al SVG
            console.log("clon agregado", clone); // Para depuración
        } else {
            iframeContentSnapshot = '<p>No se pudo obtener el contenido del mapa para el snapshot.</p>';
        }

        const snapshotHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Snapshot - ${temaSeleccionado}</title>
                <style>
                    body { font-family: sans-serif; margin: 20px; }
                    #visor-container { border: 1px solid #ccc; margin-bottom: 20px; overflow: hidden; }
                    #complement-container { padding: 15px; border: 1px solid #eee; background-color: #f9f9f9; border-radius: 4px; }
                </style>
            </head>
            <body>
                <h1>Snapshot - ${temaSeleccionado}</h1>
                <a href="#complement-container"><button>Complemento</button></a>
                <div id="visor-container">
                    ${iframeContentSnapshot}
                </div>
                <div id="complement-container">
                    ${complementContent}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([snapshotHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `snapshot_${temaSeleccionado.replace(/ /g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

}); // Fin del bloque if(isSnapshot)
} // Fin del bloque else