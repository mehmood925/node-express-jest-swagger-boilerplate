import mongoose from 'mongoose'

const contractTransactionSchema = new mongoose.Schema({

    id: { type: String, require: true },
    contractAddress: { type: String, require: true },
    eventName: { type: String },
    lastSynced: { type: Date },
    lastBlockSynced: { type: Number },
    priority: { type: Number }


});

const contractTransaction = mongoose.model('contractTransactions', contractTransactionSchema);

export default contractTransaction