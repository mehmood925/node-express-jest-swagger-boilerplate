const express = require("express");
const accountsRouter = express.Router();
const { AccountsController } = require("../controllers/accounts");

accountsRouter.post("/register",AccountsController.register);
accountsRouter.get("/getAccounts", AccountsController.getAccountsInfo);
accountsRouter.patch("/updateBalance",AccountsController.updateBalance);
accountsRouter.get("/delete", AccountsController.delete);

module.exports = accountsRouter;
