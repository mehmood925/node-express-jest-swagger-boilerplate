const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const customFormat = format.printf(({ level, message, timestamp }) => {
  const utcTimestamp = new Date(timestamp).toISOString().split('T')[1].slice(0, 8) + ' UTC';  
  const logMessage = message instanceof Error
    ? `${message.stack || message.toString()}`
    : typeof message === 'object'
      ? JSON.stringify(message)
      : message;
  
  return `[${utcTimestamp}] ${logMessage}`;
});


const allTransports = [
  new transports.Console({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      customFormat
    ),
    handleExceptions: true,
  }),
  new DailyRotateFile({
    dirname: logDirectory,
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
      format.timestamp(),
      customFormat
    ),
    handleExceptions: true,
  })
];

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: allTransports,
  exitOnError: false,
});

logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = { logger };
