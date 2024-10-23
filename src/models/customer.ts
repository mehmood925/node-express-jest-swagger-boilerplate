import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    displayName: { type: String, require: true },
    planID: { type: String, require: true },
    nextBillingDate: { type: String, require: true },
    isEmailVerified: { type: Boolean, require: true, default: false },
    stripeCustomerId: { type: String },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const customer = mongoose.model('customers', customerSchema);

export default customer; 