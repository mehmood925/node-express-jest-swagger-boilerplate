import { randomUUID } from "crypto";
import response from "../utility/response.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import app from "../entity/app.js";
import env from 'dotenv'
import _enum from "../constant/enum.js";
import appCredentials from "../entity/appCredentials.js";
import { ObjectId } from 'mongodb';
import db from '../server.js';
env.config();

class appModel {
    constructor() { }

    async findAll(params: any) {
        const _result: any = await app.find({
            customerID: params.user.userID,
            $or: [{
                state: _enum.appStateEnum.DRAFT
            }, {
                state: _enum.appStateEnum.READY
            }, {
                state: _enum.appStateEnum.LIVE
            }],
        }).skip(parseInt(params.offset))
            .limit(parseInt(params.limit))
            .sort({ _id: -1 });
        if (!_result) {
            return new response(404, 'Record Not Found');
        }
        return new response(200, _result);
    }

    async findAllTerminated(params: any) {
        const _result: any = await app.find({
            customerID: params.user.userID,
            state: _enum.appStateEnum.TERMINATED
        }).skip(parseInt(params.offset))
            .limit(parseInt(params.limit))
            .sort({ _id: -1 });
        if (!_result) {
            return new response(404, 'Record Not Found');
        }
        return new response(200, _result);
    }

    async checkAppOwnership(params: any) {
        const _result: any = await app.findOne({ customerID: params.user.userID, _id: params.appID });
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async findByID(params: any) {
        const _result: any = await app.findById(params.appID);
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async createApp(params: any) {
        const objectId: any = new ObjectId();
        const _app: any = new app();
        const _appCredentials: any = new appCredentials();

        _app._id = objectId;
        _app.name = params.name;
        _app.version = params.version;
        _app.customerID = params.user.userID;
        _app.type = params.type;
        _app.state = _enum.appStateEnum.DRAFT;
        _app.createdAt = new Date().toUTCString();
        _app.updatedAt = new Date().toUTCString();

        if(params.type === 'node') _app.appSecret = randomUUID().toString();
        else _app.appSecret = null;

        _appCredentials._id = objectId;
        _appCredentials.applicationID = bcrypt.hashSync(randomUUID().toString(), bcrypt.genSaltSync());
        _appCredentials.masterKey = bcrypt.hashSync(randomUUID().toString(), bcrypt.genSaltSync());
        _appCredentials.secretKey = bcrypt.hashSync(randomUUID().toString(), bcrypt.genSaltSync());
        _appCredentials.createdAt = new Date().toUTCString();
        _appCredentials.updatedAt = new Date().toUTCString();

        try {
            const session = await db.startSession();
            await session.withTransaction(async () => {
                await _app.save({ session: session });
                await _appCredentials.save({ session: session });
            })
            session.endSession()
        } catch (error: any) {
            return new response(400, error.message)
        }

        return new response(201, 'Record Created Successfully');
    }

}
export default appModel; 