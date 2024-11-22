const { randomUUID } = require("crypto");
const ERROR_CODES = require('../constant/error-messages.js');
const CustomError = require('../utils/error.js');
const { User } = require("../models/models.js");
const { ObjectId } = require('mongodb');

class UserDal {

    static async create(params) {
        console.log({params})
        const objectId = new ObjectId();
        let _user = new User();
        _user.id = objectId;
        _user.email = params.email;
        _user.password = params.password;
        _user.role = params.role;
        _user.createdAt = new Date().toUTCString();
        _user.updatedAt = new Date().toUTCString();
        const _object = await _user.save();
        return _object;
    }

    static async findAll(params) {
        const _response = await User.find()
        .skip(parseInt(params.offset))
        .limit(parseInt(params.limit))
        .sort({ _id: -1 });
        if (!_response) {
            throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
        }
        return _response;
    }

    static async findOne(params) {
        const _response = await User.findOne({email:params.email}).select('_id username password');
        return _response;
    }

    static async findById(params) {
        const _response = await User.findById(params.id);
        if (_response) {
            throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
        }
        return _response;
    }
}

module.exports = { UserDal };
