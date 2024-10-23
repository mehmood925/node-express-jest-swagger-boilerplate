import mongoose from 'mongoose'

const inAppNotificationSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    isRead: { type: Boolean, require: true, default: false },
    message: { type: String, require: true },
    type: { type: String, require: true },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const inAppNotification = mongoose.model('inappnotifications', inAppNotificationSchema);

export default inAppNotification