const express = require('express');
const router = express.Router();
const userRouter = require('./user');

const setRouter = (app) => {
  app.use('/api/v1', router);
  router.use(`/user`, userRouter);
};

module.exports = { setRouter };
