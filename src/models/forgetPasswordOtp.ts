import mongoose from 'mongoose'

const forgetPasswordOtpSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    customerEmail: { type: String, require: true },
    otp: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const forgetPasswordOtp = mongoose.model('forgetpasswordotps', forgetPasswordOtpSchema);

export default forgetPasswordOtp