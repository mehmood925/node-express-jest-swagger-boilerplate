import mongoose from 'mongoose'

const appSchema = new mongoose.Schema({

    name: { type: String, require: true },
    version: { type: String, require: true },
    customerID: { type: String, require: true },
    type: { type: String, require: true },
    appSecret: { type: String },
    state: { type: Number, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const app = mongoose.model('apps', appSchema);

export default app