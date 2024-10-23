import mongoose from 'mongoose'

const channelCredentialsSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    channelName: { type: String, require: true },
    
    // telegram
    botToken: { type: String },
    chatId: { type: String },
    
    // discord
    webhookURL: { type: String },
    username: { type: String },
    
    // twitter
    consumerKey: { type: String },
    consumerSecret: { type: String },
    accessToken: { type: String },
    accessTokenSecret: { type: String },
    
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const channelCredentials = mongoose.model('channelcredentials', channelCredentialsSchema);

export default channelCredentials