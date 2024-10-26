const CustomError = require('./error');

const responseHandler = (data) => {
  const { response, message = 'success', result, code = 200 } = data;
  return response.status(code).json({
    code,
    message,
    result,
  });
};

const globalErrorHandler = (err, request, response, next) => {
  if (!(err instanceof CustomError)) {
    if (err instanceof Error) {
      err = new CustomError({
        message: err.message,
      });
    }
  }

  if (request?.body?.user) {
    request.body.user = null;
  }
  return responseHandler({
    response,
    message: err.message,
    result: null,
    code: err.code || 500,
    errors: [err],
    isSuccess: false,
  });
};

module.exports = {
  responseHandler,
  globalErrorHandler,
};
