import mongoose from 'mongoose'

const emailVerificationCustomersSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    customerEmail: { type: String, require: true },
    otp: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const emailVerificationCustomers = mongoose.model('emailverificationcustomers', emailVerificationCustomersSchema);

export default emailVerificationCustomers