const winston = require('winston');
const path = require('path');
const fs = require("node:fs");

// Opciones de formato para los logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${
            Object.keys(meta).length > 0 ? JSON.stringify(meta) : ''
        }`;
    })
);

// Crear el directorio de logs si no existe
const logsDir = path.join(__dirname, '../../Logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Definir la ejecucion
const execution = new Date().getTime()
// Opciones de transporte (dónde se guardarán los logs)
const transports = [
    // new winston.transports.Console(), // Mostrar logs en la consola
    new winston.transports.File({ filename: path.join(__dirname, `../../Logs/error-${execution}.log`), level: 'error' }), // Guardar errores en un archivo
    new winston.transports.File({ filename: path.join(__dirname, `../../Logs/combined-${execution}.log`) }), // Guardar todos los logs en otro archivo
];

// Crear el logger
const logger = winston.createLogger({
    level: 'info', // Nivel mínimo de log a registrar
    format: logFormat,
    transports,
});

module.exports = logger;