import mongoose from 'mongoose'

const customerFeedbackSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    customerEmail: { type: String, require: true },
    message: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const customerFeedback = mongoose.model('customerfeedbacks', customerFeedbackSchema);

export default customerFeedback