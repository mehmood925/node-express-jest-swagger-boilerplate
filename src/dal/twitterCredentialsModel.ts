import channelCredentials from "../entity/channelCredentials.js";
import response from "../utility/response.js";
import env from 'dotenv'
env.config();

class twitterCredentialsModel {
    constructor() { }

    async create(params: any) {

        const _validate = this.validate(params)
        if (_validate.responseCode !== 200) {
            return _validate
        }

        const _credentialsCheck = await channelCredentials.findOne({
            customerID: params.user.userID,
            channelName: params.channelName
        });
        if (_credentialsCheck) return new response(632, 'Record Already Exists');

        const _credentials = new channelCredentials();
        _credentials.customerID = params.user.userID;
        _credentials.channelName = params.channelName;
        _credentials.consumerKey = params.consumerKey;
        _credentials.consumerSecret = params.consumerSecret;
        _credentials.accessToken = params.accessToken;
        _credentials.accessTokenSecret = params.accessTokenSecret;
        _credentials.createdAt = new Date().toUTCString();
        _credentials.updatedAt = new Date().toUTCString();
        await _credentials.save();

        return new response(201, 'Record Created Successfully');
    }

    async update(params: any) {

        const _validate = this.validate(params)

        if (_validate.responseCode !== 200) {
            return new response(_validate.responseCode, _validate.responseData)
        }
        const _credentialsCheck = await channelCredentials.findById(params.id);
        if (!_credentialsCheck) return new response(404, 'Record Not Found');
        if (_credentialsCheck.customerID !== params.user.userID) return new response(404, '')

        const _res = await channelCredentials.findByIdAndUpdate(params.id,
            {
                consumerKey: params.consumerKey,
                consumerSecret: params.consumerSecret,
                accessToken: params.accessToken,
                accessTokenSecret: params.accessTokenSecret,
                updatedAt: new Date().toUTCString()
            });

        if (_res === null) {
            return new response(404, 'Record Not Found');
        }
        return new response(200, 'Record Updated Successfully');
    }

    validate(params: any) {
        if (!params.consumerKey || !params.consumerSecret
            || !params.accessToken || !params.accessTokenSecret) {
            return new response(600, 'Invalid Credentials')
        }
        params.channelName = params.channelName.toLowerCase();

        return new response(200, '')
    }

}
export default twitterCredentialsModel; 