import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({

    id: { type: String, require: true },
    userID: { type: String, require: true },
    subscriptions: { type: Array, require: true },
    // contractID : { type:String, require: true },
    // contractAddress : { type:String, require:true },
    // eventName : { type:String, require:true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }

});

const subscription = mongoose.model('subscriptions', subscriptionSchema);

export default subscription;