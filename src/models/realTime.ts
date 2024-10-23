import mongoose from 'mongoose'

const realTimeNotificationSchema = new mongoose.Schema({

    id: { type: String, require: true },
    users: { type: Array },


});

const realTimeTransaction = mongoose.model('realTimeNotification', realTimeNotificationSchema);

export default realTimeTransaction