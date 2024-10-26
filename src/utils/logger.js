const { createLogger, format, transports } = require('winston');

const colorizer = format.colorize();

const allTransports = [
  new transports.Console({
    level: 'info',
    format: format.combine(
      format.simple(),
      format.printf((msg) =>
        colorizer.colorize(
          msg.level,
          `${msg.timestamp} - [${msg.level}] - ${msg.message}${
            msg.meta ? `- ${JSON.stringify(msg.meta)}` : ''
          }`,
        ),
      ),
    ),
    handleExceptions: true,
  }),
];

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: allTransports,
  exitOnError: false,
});

logger.stream = {
  write(message) {
    if (message) {
      logger.info(message.slice(0, -1));
    }
  },
};

module.exports = { logger };
