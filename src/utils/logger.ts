import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'info', // Log only if info level or higher
    format: combine(
        colorize(), // Colorize the output
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to each log
        logFormat // Use the custom log format
    ),
    transports: [
        new transports.Console(), // Output logs to the console
        new transports.File({ filename: 'logs/app.log' }), // Save logs to a file
    ],
});

// Export the logger instance
export default logger;
