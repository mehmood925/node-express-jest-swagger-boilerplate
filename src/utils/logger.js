const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const _logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(_logDirectory)) {
  fs.mkdirSync(_logDirectory);
}

const _customFormat = format.printf(({ level, message, timestamp }) => {
  const _utcTimestamp =
    new Date(timestamp).toISOString().split('T')[1].slice(0, 8) + ' UTC';
  const _logMessage =
    message instanceof Error
      ? `${message.stack || message.toString()}`
      : typeof message === 'object'
      ? JSON.stringify(message)
      : message;

  return `[${_utcTimestamp}] ${_logMessage}`;
});

const _allTransports = [
  new transports.Console({
    level: 'info',
    format: format.combine(format.timestamp(), _customFormat),
    handleExceptions: true,
  }),
  new DailyRotateFile({
    dirname: _logDirectory,
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(format.timestamp(), _customFormat),
    handleExceptions: true,
  }),
];

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: _allTransports,
  exitOnError: false,
});

logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = { logger };
