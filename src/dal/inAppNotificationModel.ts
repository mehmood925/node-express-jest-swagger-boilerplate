import { randomUUID } from "crypto";
import response from "../utility/response.js";
import logger from "../utility/logger.js";
import inAppNotification from "../entity/inAppNotifications.js";

class inAppNotificationModel {
    constructor() { }

    validateInAppNotification(params: any) {
        if (params.customerID == undefined || params.customerID == ''
            || params.message == undefined || params.message == ''
            || params.type == undefined || params.type == '') {
            return new response(600, 'JOI Validation Error');
        }
        return new response(200, 'Success');
    }

    async findAll(params: any) {
        if (params.userID == undefined || params.userID == ''
            || params.page == undefined || params.page < 1
            || params.limit == undefined || params.limit < 1) {
            return new response(600, 'JOI Validation Error');
        }
        const offset = params.limit * (params.page - 1)
        const limit = params.limit
        const _result: any = await inAppNotification.find({ customerID: params.userID })
            .skip(offset)
            .limit(limit)
            .sort({ _id: -1 });
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async updateOne(params: any) {
        if (params == undefined || params == '') {
            return new response(600, 'JOI Validation Error');
        }
        const _result: any = await inAppNotification.updateOne({ _id: params }, { isRead: true });
        if (_result) {
            return new response(200, _result);
        }
        return new response(400, 'Bad Request');
    }

    async save(params: any) {

        const _inAppNotification = new inAppNotification();
        _inAppNotification.customerID = params.customerID;
        _inAppNotification.message = params.message;
        _inAppNotification.type = params.type;
        _inAppNotification.isRead = false;
        _inAppNotification.createdAt = new Date().toUTCString();
        _inAppNotification.updatedAt = new Date().toUTCString();

        await _inAppNotification.save();

        return new response(201, 'Record Created Successfully');
    }


}
export default inAppNotificationModel; 