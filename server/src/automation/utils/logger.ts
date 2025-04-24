import winston from 'winston';

let logger: any;

try {
  if (!winston.format || !winston.format.combine) {
    throw new Error('Winston format is undefined');
  }
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'poshmark-automation' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }
} catch (e) {
  // Fallback no-op logger for testing
  logger = {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  };
}

export { logger };
