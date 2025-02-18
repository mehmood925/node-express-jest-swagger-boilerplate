const CustomError = require('./error');

const responseHandler = (data) => {
  const { response, message = 'success', result, code = 200 } = data;
  return response.status(code).json({
    code,
    message,
    result,
  });
};

const globalErrorHandler = (error, request, response, next) => {
  if (!(error instanceof CustomError)) {
    if (error instanceof Error) {
      error = new CustomError({
        message: error.message,
      });
    }
  }

  if (request?.body?.user) {
    request.body.user = null;
  }
  return responseHandler({
    response: response,
    message: error.message,
    result: null,
    code: error.code || 500,
    errors: [error],
    isSuccess: false,
  });
};

module.exports = {
  responseHandler,
  globalErrorHandler,
};
