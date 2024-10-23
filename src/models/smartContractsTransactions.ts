import mongoose from 'mongoose'

const smartContractsTransactionsSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    appName: { type: String, require: true },
    contractAddress: { type: String, require: true },
    eventName: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const smartContractsTransactions = mongoose.model('smartcontractstransactions', smartContractsTransactionsSchema);

export default smartContractsTransactions