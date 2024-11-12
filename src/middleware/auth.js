require('dotenv').config();
const jwt = require('jsonwebtoken');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const { UserDal, UserTokenDal } = require('../dal/index');

const verifyAuthToken = async (token) => {
  const _verifiedToken = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
  if (
    !_verifiedToken ||
    (_verifiedToken.exp && Math.floor(Date.now() / 1000) > _verifiedToken.exp)
  ) {
    throw new CustomError(ERROR_CODES.AUTH_TOKEN_EXPIRED);
  }
  return _verifiedToken;
};

const validateAuthToken = (token) => {
  if (!token) throw new CustomError(ERROR_CODES.AUTH_TOKEN_EXPIRED);
  const [_bearer, _authToken] = token.split(' ');
  if (_bearer !== 'Bearer' || !_authToken) return null;
  return _authToken;
};

const authMiddleware = (roles) => async (req, res, next) => {
  try {
    const _token = validateAuthToken(req.headers.authorization);
    if (!_token)
      return res
        .status(401)
        .send({ code: 401, message: 'Authorization header is required' });

    const _verifiedToken = await verifyAuthToken(_token);
    const _userTokens = await UserTokenDal.findAll({
      where: { userId: _verifiedToken.id },
    });

    if (!_userTokens.some((item) => item.token === _token))
      return res
        .status(401)
        .send({ code: 401, message: 'Authorization header is invalid' });

    const _user = await UserDal.findOne({ where: { id: _verifiedToken.id } });
    if (!_user?.isActive || !roles.includes(_user.role))
      throw new CustomError(ERROR_CODES.UNAUTHORISED);
    //if (!user.emailVerified) throw new CustomError(ERROR_CODES.VERIFY_EMAIL);

    delete _user.password;
    req.headers.loggedUser = _user;
    req.headers.token = _token;
    return next();
  } catch (error) {
    if (error?.expiredAt)
      return res.status(401).send({
        code: 401,
        message: 'Authorization token is expired',
        result: null,
      });
    return next(error);
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
