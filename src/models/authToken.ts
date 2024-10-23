import mongoose from 'mongoose'

const authTokenSchema = new mongoose.Schema({

    token: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const authToken = mongoose.model('authtokens', authTokenSchema);

export default authToken