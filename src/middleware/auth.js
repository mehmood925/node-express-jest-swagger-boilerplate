require('dotenv').config();
const jwt = require('jsonwebtoken');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const { UserDal } = require('../dal/user');

const verifyAuthToken = async (token) => {
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
  if (
    !verifiedToken ||
    (verifiedToken.exp && Math.floor(Date.now() / 1000) > verifiedToken.exp)
  ) {
    throw new CustomError(ERROR_CODES.AUTH_TOKEN_EXPIRED);
  }
  return verifiedToken;
};

const validateAuthToken = (token) => {
  if (!token) throw new CustomError(ERROR_CODES.AUTH_TOKEN_EXPIRED);
  const [bearer, authToken] = token.split(' ');
  if (bearer !== 'Bearer' || !authToken) return null;
  return authToken;
};

const authMiddleware = (roles) => async (req, res, next) => {
  try {
    const token = validateAuthToken(req.headers.authorization);
    if (!token)
      return res
        .status(401)
        .send({ code: 401, message: 'Authorization header is required' });

    const verifiedToken = await verifyAuthToken(token);
    const userTokens = await UserTokensDal.getAllByIndex(
      'user_id',
      verifiedToken.id,
    );
    if (!userTokens.some((item) => item.token === token))
      return res
        .status(401)
        .send({ code: 401, message: 'Authorization header is invalid' });

    const user = await UserDal.getByIndex('id', verifiedToken.id);
    if (!user?.is_active || !roles.includes(user.role))
      throw new CustomError(ERROR_CODES.UNAUTHENTICATED);
    if (!user.email_verified) throw new CustomError(ERROR_CODES.VERIFY_EMAIL);
    delete user.password;
    req.headers.loggedUser = user;
    req.headers.token = token;
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
