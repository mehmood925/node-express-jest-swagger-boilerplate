const express = require("express");
const companiesRouter = express.Router();
const { CompanyController } = require("../controllers/company");

companiesRouter.post("/register",CompanyController.register);
companiesRouter.get("/getCompanies", CompanyController.getCompaniesInfo);
companiesRouter.get("/delete", CompanyController.delete);

module.exports = companiesRouter;
