const CustomError = require('./error');

const responseHandler = (_data) => {
  const { response, message = 'success', result, code = 200 } = _data;
  return response.status(code).json({
    code,
    message,
    result,
  });
};

const globalErrorHandler = (_error, _request, _response, _next) => {
  if (!(_error instanceof CustomError)) {
    if (_error instanceof Error) {
      _error = new CustomError({
        message: _error.message,
      });
    }
  }

  if (_request?.body?.user) {
    _request.body.user = null;
  }
  return responseHandler({
    response: _response,
    message: _error.message,
    result: null,
    code: _error.code || 500,
    errors: [_error],
    isSuccess: false,
  });
};

module.exports = {
  responseHandler,
  globalErrorHandler,
};
