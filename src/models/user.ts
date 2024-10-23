import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    pushID: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String }
});

const user = mongoose.model('users', userSchema);

export default user; 