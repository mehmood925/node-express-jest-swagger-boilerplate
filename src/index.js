require('dotenv').config();
const _express = require('express');
const _http = require('http');
const _cors = require('cors');
const _bodyParser = require('body-parser');
const _swaggerUi = require('swagger-ui-express');
const _swaggerDocument = require('./swagger.json');
const { setRouter } = require('./routes/api');
const { globalErrorHandler } = require('./utils/response');
const { logger } = require('./utils/logger');
const { CronClass } = require('./crons/cron');

/*///////////////// EXPRESS APP /////////////////*/
const _app = _express();
_app.server = _http.createServer(_app);

/*///////////////// BODY PARSER /////////////////*/
_app.use(_bodyParser.urlencoded({ extended: false }));

/*//////////// PARSE application/json ///////////*/
_app.use(
  _bodyParser.json({
    limit: `${process.env.BODYPARSER_LIMIT}kb`,
  })
);

/*//////////////////// CORS ////////////////////*/
_app.use(
  _cors({
    maxAge: process.env.CORS_MAX_AGE_SEC,
  })
);

/*///////////////// SWAGGER UI /////////////////*/
if (process.env.ENV === 'development') {
  _app.use('/api-docs', _swaggerUi.serve, _swaggerUi.setup(_swaggerDocument));
}

/*///////////// SET PUBLIC ROUTER //////////////*/
setRouter(_app);

/*///// GLOBAL ERROR LANDLER AS MIDDLEWARE ////*/
_app.use((_err, _req, _res, _next) =>
  globalErrorHandler(_err, _req, _res, _next)
);

// CRON JOBS
CronClass.sampleCronJob();

/*//////////// EXPRESS APP SERVER /////////////*/
_app.server.listen(process.env.PORT || 3000, () => {
  logger.info(
    `Started server on => http://localhost:${_app.server.address().port}`
  );
  logger.info(
    `Docs available on => http://localhost:${
      _app.server.address().port
    }/api-docs`
  );
});
