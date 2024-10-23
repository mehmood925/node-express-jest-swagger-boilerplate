import mongoose from 'mongoose'

const userNotificationSchema = new mongoose.Schema({
    id: { type: String, require: true },
    userID: { type: String, require: true },
    contractID: { type: String, require: true },
    contractAddress: { type: String, require: true },
    chain: { type: String, require: true },
    event: { type: String, require: true },
    notification: { type: String, require: true },
    createdAt: { type: String },
    updatedAt: { type: String }
});

const userNotifications = mongoose.model('userNotifications', userNotificationSchema);

export default userNotifications; 