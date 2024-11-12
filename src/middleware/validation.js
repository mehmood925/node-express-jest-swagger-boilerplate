const validationMiddleware =
  (_validationObject, _isGet = false) =>
  (_req, _res, _next) => {
    const _body = _isGet ? _req.query : _req.body;
    const { error } = _validationObject.validate(_body);
    if (error) {
      let _errMessage = error.details[0].message
        ? error.details[0].message
        : error.message;
      _errMessage = _errMessage.replace(/[[\]""]+/g, '');
      return _res
        .status(400)
        .send({ code: 400, message: _errMessage, result: null });
    }
    return _next();
  };

module.exports = validationMiddleware;
