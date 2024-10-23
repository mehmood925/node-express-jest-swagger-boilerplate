import { randomUUID } from "crypto";
import response from "../utility/response.js";
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'
// import logger from "../utility/logger.js";
// import app from "../entity/app.js";
import appContract from "../entity/appContract.js";
import contract from "../entity/contract.js";
import _enum from "../constant/enum.js";

class appSettingModel {
    constructor() { }

    async findByID(params: any) {
        const _result: any = await appContract.findById(params.contractID);
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async findOne(params: any) {
        const _result: any = await appContract.findOne({ appID: params.appID });
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async findAll(params: any) {
        const _result: any = await appContract.find({
            appID: params.appID,
            $or: [{
                state: _enum.appContractStateEnum.DRAFT
            }, {
                state: _enum.appContractStateEnum.READY
            }, {
                state: _enum.appContractStateEnum.LIVE
            }],
        }).select('-contractEvents')
            .skip(parseInt(params.offset))
            .limit(parseInt(params.limit))
            .sort({ _id: -1 });
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async findAllTerminated(params: any) {
        const _result: any = await appContract.find({
            appID: params.appID,
            state: _enum.appContractStateEnum.TERMINATED,
        }).select('-contractEvents')
            .skip(parseInt(params.offset))
            .limit(parseInt(params.limit))
            .sort({ _id: -1 });
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async findOneEvent(params: any) {
        const _result: any = await appContract.findOne({ appID: params.appid, contractID: params.contractID });
        if (_result) {
            return new response(200, _result);
        }
        return new response(404, 'Record Not Found');
    }

    async save(params: any) {

        const _contract: any = await contract.findById(params.contractID);
        if (!_contract) {
            return new response(404, 'Smart Contract Not Found')
        }
        const _app = new appContract();
        _app.appID = params.appID;
        _app.name = _contract.name;
        _app.contractID = _contract._id;
        _app.contractEvents = [];
        _app.contractAddress = _contract.contractAddress;
        _app.chain = _contract.chain;
        _app.status = _enum.appContractStatusEnum.NOT_VERIFIED;
        _app.state = _enum.appContractStateEnum.DRAFT;
        _app.totalEvents = _contract.events.length;
        _app.configuredEvents = 0;
        _app.lastScannedAt = new Date().getTime();
        _app.lastBlock = 0;
        _app.createdAt = new Date().toUTCString();
        _app.updatedAt = new Date().toUTCString();

        await _app.save();
        return new response(201, 'Record Created Successfully');
    }


}
export default appSettingModel; 