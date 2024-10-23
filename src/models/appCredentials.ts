import mongoose from 'mongoose'

const appCredentialsSchema = new mongoose.Schema({

    applicationID: { type: String, require: true },
    masterKey: { type: String, require: true },
    secretKey: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const appCredentials = mongoose.model('appcredentials', appCredentialsSchema);

export default appCredentials