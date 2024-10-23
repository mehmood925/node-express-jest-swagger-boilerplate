import mongoose from 'mongoose'

const paymentDetailsSchema = new mongoose.Schema({

    cardToken: { type: String, require: true },
    cardType: { type: String, require: true },
    country: { type: String, require: true },
    customerID: { type: String, require: true },
    expMonth: { type: Number, require: true },
    expYear: { type: Number, require: true },
    fingerprint: { type: String, require: true },
    funding: { type: String, require: true },
    lastFourDigits: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const paymentDetails = mongoose.model('paymentdetails', paymentDetailsSchema);

export default paymentDetails