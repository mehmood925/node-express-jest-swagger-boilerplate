import mongoose from 'mongoose'

const contractSchema = new mongoose.Schema({

    name: { type: String, require: true },
    symbol: { type: String },
    logo: { type: String },
    chain: { type: String, require: true },
    contractAddress: { type: String, require: true },
    abi: { type: Object, require: true },
    events: { type: Object },
    customerID: { type: String, require: true },


});

const contract = mongoose.model('contracts', contractSchema);

export default contract