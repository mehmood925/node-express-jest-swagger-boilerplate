const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        primaryKey: true,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const resetPasswordTokenSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        primaryKey: true,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('users', userSchema);
const ResetPasswordToken = mongoose.model('resetpasswordtokens', resetPasswordTokenSchema);

module.exports = {
    User,
    ResetPasswordToken,
};
