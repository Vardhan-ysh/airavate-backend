import { createLogger, format, transports } from 'winston';
import environment from '@config/environment';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Create logger instance
const logger = createLogger({
  level: environment.LOG_LEVEL || 'info',
  levels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    
    // File transports for production
    ...(environment.NODE_ENV === 'production' ? [
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
      }),
      new transports.File({
        filename: 'logs/combined.log',
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
      }),
    ] : []),
  ],
});

// Add colors to winston
import('winston').then((winston) => {
  winston.addColors(colors);
});

// Export logger methods
export const logInfo = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: any): void => {
  logger.error(message, error);
};

export const logDebug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
};

export const logWarn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

export const logHttp = (message: string, meta?: any): void => {
  logger.http(message, meta);
};

export default logger;