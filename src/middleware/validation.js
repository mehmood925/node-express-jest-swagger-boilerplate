const validationMiddleware =
  (validationObject, isGet = false) =>
  (req, res, next) => {
    const _body = isGet ? req.query : req.body;
    const { error } = validationObject.validate(_body);
    if (error) {
      let _errMessage = error.details[0].message
        ? error.details[0].message
        : error.message;
      _errMessage = _errMessage.replace(/[[\]""]+/g, '');
      return res
        .status(400)
        .send({ code: 400, message: _errMessage, result: null });
    }
    return next();
  };

module.exports = validationMiddleware;
