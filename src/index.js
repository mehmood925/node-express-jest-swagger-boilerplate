require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const mongoose = require('mongoose');
//const { setRouter } = require("./routes/api");
const { globalErrorHandler } = require("./utils/response");

/////////////////// EXPRESS APP ///////////////////
const app = express();
app.server = http.createServer(app);

/////////////////// BODY PARSER ///////////////////
app.use(bodyParser.urlencoded({ extended: false }));

////////////// PARSE application/json /////////////
app.use(
  bodyParser.json({
    limit: `${process.env.BODYPARSER_LIMIT}kb`,
  })
);

////////////////////// CORS //////////////////////
app.use(
  cors({
    maxAge: process.env.CORS_MAX_AGE_SEC,
  })
);

/////////////////// SWAGGER UI ///////////////////
if (process.env.ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

/////////////// SET PUBLIC ROUTER ////////////////
//setRouter(app);

/////// GLOBAL ERROR HANDLER AS MIDDLEWARE ///////
app.use((err, req, res, next) => globalErrorHandler(err, req, res, next));

/////////////// START SERVER INDEPENDENTLY ///////////////
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

////////////// MONGODB CONNECTION //////////////////
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {})
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = { app };
