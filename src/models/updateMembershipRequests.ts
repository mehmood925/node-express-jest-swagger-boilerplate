import mongoose from 'mongoose'

const updateMembershipRequestsSchema = new mongoose.Schema({

    customerID: { type: String, require: true },
    customerEmail: { type: String, require: true },
    cuurentPlanID: { type: String, require: true },
    cuurentPlanName: { type: String, require: true },
    requestedPlanID: { type: String, require: true },
    requestedPlanName: { type: String, require: true },
    status: { type: String, require: true },
    isApproved:  { type: Boolean, require: true, default: false },
    createdAt: { type: String, require: true },
    updatedAt: { type: String, require: true }
});

const updateMembershipRequests = mongoose.model('updatemembershiprequests', updateMembershipRequestsSchema);

export default updateMembershipRequests