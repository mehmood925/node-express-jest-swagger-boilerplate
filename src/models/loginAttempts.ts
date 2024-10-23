import mongoose from 'mongoose'

const loginAttemptsSchema = new mongoose.Schema({

    email: { type: String, require: true },
    failedAttempts: { type: Number, require: true },
    isLocked: { type: Boolean, default: false, require: true },
    lastFailedAttemptAt: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const loginAttempts = mongoose.model('loginattempts', loginAttemptsSchema);

export default loginAttempts