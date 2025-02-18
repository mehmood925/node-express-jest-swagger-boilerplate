const validationMiddleware =
  (validationObject, type = 'body') =>
  (req, res, next) => {
    const requestObject = type === 'body' ? req.body : req.query;
    const { error } = validationObject.validate(requestObject);
    if (error) {
      let errMessage = error.details[0].message
        ? error.details[0].message
        : error.message;
      errMessage = errMessage.replace(/[[\]""]+/g, '');
      return res
        .status(400)
        .send({ code: 400, message: errMessage, result: null });
    }
    return next();
  };

module.exports = validationMiddleware;
