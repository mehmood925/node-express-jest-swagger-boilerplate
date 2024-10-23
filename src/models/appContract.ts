import mongoose from 'mongoose'

const appContractSchema = new mongoose.Schema({

    name: { type: String, require: true },
    appID: { type: String, require: true },
    contractID: { type: String, require: true },
    contractEvents: { type: Array, require: true },
    contractAddress: { type: String, require: true },
    chain: { type: String, require: true },
    status: { type: Number, require: true },
    state: { type: Number, require: true },
    configuredEvents: { type: Number, require: true },
    totalEvents: { type: Number, require: true },
    lastScannedAt: { type: Number, require: true },
    lastBlock: { type: Number, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true },
});

const appContract = mongoose.model('appContracts', appContractSchema);

export default appContract