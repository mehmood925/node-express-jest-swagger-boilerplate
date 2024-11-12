const _express = require('express');
const _router = _express.Router();
const _userRouter = require('./user');

const setRouter = (_app) => {
  _app.use('/api/v1', _router);
  _router.use(`/user`, _userRouter);
};

module.exports = { setRouter };
