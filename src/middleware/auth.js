require('dotenv').config();
const _jwt = require('jsonwebtoken');
const _ERROR_CODES = require('../constant/error-messages');
const _CustomError = require('../utils/error');
const { UserDal, UserTokenDal } = require('../dal/index');

const verifyAuthToken = async (_token) => {
  const _verifiedToken = _jwt.verify(_token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
  if (
    !_verifiedToken ||
    (_verifiedToken.exp && Math.floor(Date.now() / 1000) > _verifiedToken.exp)
  ) {
    throw new _CustomError(_ERROR_CODES.AUTH_TOKEN_EXPIRED);
  }
  return _verifiedToken;
};

const validateAuthToken = (_token) => {
  if (!_token) throw new _CustomError(_ERROR_CODES.AUTH_TOKEN_EXPIRED);
  const [_bearer, _authToken] = _token.split(' ');
  if (_bearer !== 'Bearer' || !_authToken) return null;
  return _authToken;
};

const authMiddleware = (_roles) => async (_req, _res, _next) => {
  try {
    const _token = validateAuthToken(_req.headers.authorization);
    if (!_token)
      return _res
        .status(401)
        .send({ code: 401, message: 'Authorization header is required' });

    const _verifiedToken = await verifyAuthToken(_token);
    const _userTokens = await UserTokenDal.findAll({
      where: { userId: _verifiedToken.id },
    });

    if (!_userTokens.some((_item) => _item.token === _token))
      return _res
        .status(401)
        .send({ code: 401, message: 'Authorization header is invalid' });

    const _user = await UserDal.findOne({ where: { id: _verifiedToken.id } });
    if (!_user?.isActive || !_roles.includes(_user.role))
      throw new _CustomError(_ERROR_CODES.UNAUTHORISED);
    //if (!_user.emailVerified) throw new _CustomError(_ERROR_CODES.VERIFY_EMAIL);

    delete _user.password;
    _req.headers.loggedUser = _user;
    _req.headers.token = _token;
    return _next();
  } catch (_error) {
    if (_error?.expiredAt)
      return _res.status(401).send({
        code: 401,
        message: 'Authorization token is expired',
        result: null,
      });
    return _next(_error);
  }
};

const generateTokens = (payload) => ({
  accessToken: jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  }),
  refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  }),
});

module.exports = { authMiddleware, generateTokens };
