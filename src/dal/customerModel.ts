import { randomUUID } from "crypto";
import user from "../entity/user.js";
import response from "../utility/response.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import logger from "../utility/logger.js";
import customer from "../entity/customer.js";
import sendEmail from "../utility/sendEmail.js";
import forgetPasswordOtp from "../entity/forgetPasswordOtp.js";
import customerFeedback from "../entity/customerFeedback.js";
import env from 'dotenv'
import fs from 'fs'
import path from 'path'
import { validateConfirmEmailToken, validatePasswordToken } from "../middleWare/auth.js";
import inAppNotificationService from "../service/inAppNotificationService.js";
import enums from '../constant/enum.js';
import emailVerificationCustomers from "../entity/emailVerificationCustomers.js";
import updateMembershipRequests from "../entity/updateMembershipRequests.js";
import loginAttempts from "../entity/loginAttempts.js";
import authToken from "../entity/authToken.js";
import passCom from "joi-password-complexity";
import { ObjectId } from 'mongodb';
import db from '../server.js';
import channelCredentialsFactory from "../factory/channelCredentialsFactory.js";
import channelCredentials from "../entity/channelCredentials.js";
env.config();
const _complexityOptions = {
    min: 8,
    max: 26,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
}
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51NLsCHJLPlU5v5kd1Jwnsx7JUOmj8gfLROoSFoJWzJ6fFLnQ9Xq1O7hYKnYtUZtBz4jdE90jzeG9xkC2lj5Pgfkd00d88wC55e', {
    apiVersion: '2022-11-15',
});
class customerModel {
    constructor() { }

    async signup(params: any) {

        /* Password Validation */
        const pass = passCom(_complexityOptions).validate(params.password); // password validation
        if (pass.error) {
            return new response(625, 'Password Should Be Betweem 8 - 26 Characters And Must Include Atleast One Lower Case, Upper Case, Numeric And Symbol');
        }

        /* Check for existing same email and username */
        const _existingProfile = await this.checkExistingProfile(params);
        if (_existingProfile.responseCode !== 200) {
            return new response(_existingProfile.responseCode, _existingProfile.responseData);
        }

        const objectId = new ObjectId();

        /* token/otp to confirm email */
        const _token = await this.generateEmailVerificationToken(objectId, params.username);

        let date = new Date(Date.now())
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);

        const _profile: any = new customer();
        const _emailVerificationObject: any = new emailVerificationCustomers();
        const _loginAttemptsObject: any = new loginAttempts();
        const _authTokenObject: any = new authToken();

        const stripeCustomer = await stripe.customers.create({
            email: params.email,
        });
        if(!stripeCustomer.id) return new response(638, "Stripe Customer Creation Failed");
        
        _profile._id = objectId;
        _profile.username = params.username;
        _profile.password = bcrypt.hashSync(params.password, bcrypt.genSaltSync(2));
        _profile.email = params.email;
        _profile.displayName = params.displayname;
        _profile.planID = 'null';
        _profile.nextBillingDate = date.toUTCString();
        _profile.isEmailVerified = false;
        _profile.stripeCustomerId = stripeCustomer.id;
        _profile.createdAt = new Date().toUTCString();
        _profile.updatedAt = new Date().toUTCString();

        _emailVerificationObject._id = objectId;
        _emailVerificationObject.otp = _token;
        _emailVerificationObject.customerID = objectId;
        _emailVerificationObject.customerEmail = params.email;
        _emailVerificationObject.createdAt = new Date().toUTCString();
        _emailVerificationObject.updatedAt = new Date().toUTCString();

        _loginAttemptsObject._id = objectId;
        _loginAttemptsObject.email = params.email;
        _loginAttemptsObject.failedAttempts = 0;
        _loginAttemptsObject.isLocked = false;
        _loginAttemptsObject.lastFailedAttemptAt = "null";
        _loginAttemptsObject.createdAt = new Date().toUTCString();
        _loginAttemptsObject.updatedAt = new Date().toUTCString();

        _authTokenObject._id = objectId;
        _authTokenObject.token = "null";
        _authTokenObject.createdAt = new Date().toUTCString();
        _authTokenObject.updatedAt = new Date().toUTCString();

        try {
            const session = await db.startSession();
            await session.withTransaction(async () => {
                await _profile.save({ session: session });
                await _emailVerificationObject.save({ session: session });
                await _loginAttemptsObject.save({ session: session });
                await _authTokenObject.save({ session: session });
            })
            session.endSession()
        } catch (error: any) {
            return new response(400, error.message)
        }

        /* welcome in-app notifications and emailS */
        await this.sendWelcomeNotes(objectId);
        await this.sendVerificationMail({ token: _token, email: params.email })

        return new response(201, 'Record Created Successfully');
    }

    async checkExistingProfile(params: any) {
        let _existingProfile: any = await customer.findOne({ email: params.email }).select('_id');
        if (_existingProfile) {
            return new response(601, 'Email Already Exists');
        }
        _existingProfile = await customer.findOne({ username: params.username }).select('_id');
        if (_existingProfile) {
            return new response(602, 'Username Already Exists');
        }
        return new response(200, '');
    }

    async generateEmailVerificationToken(objectId: any, username: any) {
        const _key: string = process.env.EMAIL_VERIFICATION_TOKEN_KEY ? process.env.EMAIL_VERIFICATION_TOKEN_KEY : ''
        return jwt.sign(
            { userID: objectId, username: username },
            _key,
            { expiresIn: "2h" }
        )
    }

    async sendVerificationMail(params: any) {

        const sendemail = new sendEmail()
        await sendemail.sendButtonEmail({
            email: params.email,
            data: {
                token: params.token,
            },
            type: enums.emailType.EMAIL_VERIFICATION
        })

    }

    async sendWelcomeNotes(objectId: any) {
        let _inAppNotification = new inAppNotificationService();
        await _inAppNotification.sendInAppNotification({
            customerID: objectId,
            message: enums.welcomeInAppMessage,
            type: 'info',
        });
        await _inAppNotification.sendInAppNotification({
            customerID: objectId,
            message: 'Hello! You do not have any membership plan yet. Please subscribe to one',
            type: 'alert',
        });
    }

    async signin(params: any) {
        // if email is not verified, send customerID
        if (!params._profile.isEmailVerified) {
            return new response(606, {
                customerID: params._profile._id,
            });
        }
        // else send token
        const _key: string = process.env.TOKEN_KEY ? process.env.TOKEN_KEY : ''
        const _token = jwt.sign(
            { userID: params._profile._id, username: params._profile.username },
            _key,
            { expiresIn: "2h" }
        )
        const _update: any = await authToken.updateOne({ _id: params._profile._id },
            {
                token: _token,
                updatedAt: new Date().toUTCString()
            });


        return new response(200, _token);
    }

    async updatePassword(params: any) {
        if (params.newPassword !== params.confirmPassword) {
            return new response(607, 'Password And Confirm Password Must Be Same');
        }
        const _profile: any = await customer.findById(params.user.userID).select('_id email password');
        if (!_profile) {
            return new response(404, 'Record Not Found');
        }
        if (!await bcrypt.compare(params.password, _profile.password)) {
            return new response(605, 'Incorrect Password');
        }
        const pass = passCom(_complexityOptions).validate(params.newPassword); // password validation
        if (pass.error) {

            return new response(625, 'Password Should Be Betweem 8 - 26 Characters And Must Include Atleast One Lower Case, Upper Case, Numeric And Symbol');
        }
        if (params.password === params.newPassword) {
            return new response(626, 'You Cannot Use Your Current Password As Your New Password');
        }
        const _hash = bcrypt.hashSync(params.newPassword, bcrypt.genSaltSync());
        const _update: any = await customer.updateOne({ _id: _profile.id }, { password: _hash, updatedAt: new Date().toUTCString() });
        if (_update.modifiedCount !== 1) {
            return new response(608, 'Could Not Process Due To A Technical Failure');
        }
        const _sendemail = new sendEmail()
        await _sendemail.sendNoButtonEmail({
            email: _profile.email,
            type: enums.emailType.PASSWORD_UPDATED
        })
        await authToken.updateOne({ _id: _profile._id },
            {
                token: '',
                updatedAt: new Date().toUTCString()
            });
        return new response(200, 'Success');

    }

    async validateResetPasswordOtp(params: any) {
        if (params.otp === '') {
            return new response(404, '');
        }
        const _otps: any = await forgetPasswordOtp.find({ otp: params.otp }).select('otp');
        if (!_otps) {
            return new response(404, '');
        }
        if (_otps.length === 0) {
            return new response(404, '');
        }
        return new response(200, '');
    }

    async sendFeedback(params: any) {
        const _profile: any = await customer.findById(params.user.userID).select('email');
        if (!_profile) {
            return new response(404, 'Record Not Found');
        }
        const sendemail = new sendEmail()
        await sendemail.sendEmail({
            email: process.env.SUPPORT_EMAIL,
            subject: "Customer Feedback",
            body: `{\n\t"customerID": "${params.user.userID}",\n\t"email": "${_profile.email}",\n\t"feedback": "${params.text}"\n}`
        })
        await sendemail.sendNoButtonEmail({
            email: _profile.email,
            type: enums.emailType.FEEDBACK
        })
        const _feedback = new customerFeedback();
        _feedback.id = randomUUID().toString();
        _feedback.message = params.text;
        _feedback.customerID = params.user.userID;
        _feedback.customerEmail = _profile.email;
        _feedback.createdAt = new Date().toUTCString();
        _feedback.updatedAt = new Date().toUTCString();
        await _feedback.save();
        return new response(200, 'Success');
    }

    async forgetPassword(params: any) {
        const _profile: any = await customer.findOne({ email: params.email }).select('id');
        if (!_profile) {
            return new response(200, 'Success');
        }
        const _tokenKey: string = process.env.FORGET_PASSWORD_TOKEN_KEY ? process.env.FORGET_PASSWORD_TOKEN_KEY : ''
        const _otp = jwt.sign(
            { userID: _profile.id },
            _tokenKey,
            { expiresIn: "1h" }
        )
        const otpCheck = await forgetPasswordOtp.findOne({ email: params.email });
        if (!otpCheck) {
            const _forgetPasswordOtp = new forgetPasswordOtp();
            _forgetPasswordOtp._id = _profile.id;
            _forgetPasswordOtp.otp = _otp;
            _forgetPasswordOtp.customerID = _profile.id;
            _forgetPasswordOtp.customerEmail = params.email;
            _forgetPasswordOtp.createdAt = new Date().toUTCString();
            _forgetPasswordOtp.updatedAt = new Date().toUTCString();
            await _forgetPasswordOtp.save();
        }
        else {
            const _update: any = await forgetPasswordOtp.updateOne({ email: params.email }, { otp: _otp, updatedAt: new Date().toUTCString() });
            if (_update.modifiedCount !== 1) {
                return new response(608, 'Could Not Process Due To A Technical Failure');
            }
        }
        const sendemail = new sendEmail()
        await sendemail.sendButtonEmail({
            email: params.email,
            data: {
                token: _otp,
            },
            type: enums.emailType.RESET_YOUR_PASSWORD
        })
        return new response(200, 'Success');
    }

    async resetPassword(params: any) {
        if (params.password !== params.confirmPassword) {
            return new response(607, 'Password And Confirm Password Must Be Same');
        }
        const pass = passCom(_complexityOptions).validate(params.password); // password validation
        if (pass.error) {

            return new response(625, 'Password Should Be Betweem 8 - 26 Characters And Must Include Atleast One Lower Case, Upper Case, Numeric And Symbol');
        }
        const _user: any = validatePasswordToken(params.token)
        const _profile: any = await customer.findById(_user.userID).select('_id email');
        if (!_profile) {
            return new response(616, 'Your OTP Is Expired');
        }
        const _otpCheck = await forgetPasswordOtp.findOne({ email: params.email });
        if (!_otpCheck) {
            return new response(616, 'Your OTP Is Expired');
        }
        if (params.token !== _otpCheck.otp) {
            return new response(616, 'Your OTP Is Expired');
        }
        if (_user.userID !== _profile.id) {
            return new response(616, 'Your OTP Is Expired');
        }
        const _hash = bcrypt.hashSync(params.password, bcrypt.genSaltSync());

        try {
            const session = await db.startSession();
            await session.withTransaction(async () => {
                await forgetPasswordOtp.deleteOne({ _id: _otpCheck._id }, { session: session });
                await customer.updateOne({ _id: _profile.id }, { password: _hash, updatedAt: new Date().toUTCString() }, { session: session });
                await authToken.updateOne({ _id: _user.userID }, { token: '', updatedAt: new Date().toUTCString() }, { session: session });
            })
            session.endSession()
        } catch (error: any) {
            return new response(400, error.message)
        }

        const sendemail = new sendEmail()
        await sendemail.sendNoButtonEmail({
            email: _profile.email,
            type: enums.emailType.PASSWORD_RESET
        })
        return new response(200, 'Success');
    }

    async verifyEmail(params: any) {
        const _user: any = validateConfirmEmailToken(params.otp)
        if (!_user) {
            return new response(403, 'link has expired');
        }
        const _profile: any = await customer.findById(_user.userID).select('_id email');
        if (!_profile) {
            return new response(617, 'Link Is Expired');
        }
        const _otpCheck = await emailVerificationCustomers.findOne({ customerID: _user.userID });
        if (!_otpCheck) {
            return new response(617, 'Link Is Expired');
        }
        if (params.otp !== _otpCheck.otp) {
            return new response(617, 'Link Is Expired');
        }

        try {
            const session = await db.startSession();
            await session.withTransaction(async () => {
                await customer.updateOne({ _id: _user.userID }, { isEmailVerified: true }, { session: session });
                await emailVerificationCustomers.deleteOne({ _id: _otpCheck._id }, { session: session });
            })
            session.endSession()
        } catch (error: any) {
            return new response(400, error.message)
        }
        const sendemail = new sendEmail()
        await sendemail.sendNoButtonEmail({
            email: _profile.email,
            type: enums.emailType.EMAIL_VERIFIED
        })
        return new response(200, 'Success');
    }

    async sendEmailVerificationLink(params: any) {
        const _profile: any = await customer.findById(params.customerID).select('_id email username');
        if (!_profile) {
            return new response(404, 'Record Not Found');
        }
        const _otpCheck = await emailVerificationCustomers.findOne({ customerID: _profile._id });
        if (!_otpCheck) {
            return new response(617, 'Link Is Expired');
        }
        const _key: string = process.env.EMAIL_VERIFICATION_TOKEN_KEY ? process.env.EMAIL_VERIFICATION_TOKEN_KEY : ''
        const _token = jwt.sign(
            { userID: _profile._id, username: _profile.username },
            _key,
            { expiresIn: "2h" }
        )
        const _updateOtp: any = await emailVerificationCustomers.updateOne({ _id: _profile._id }, { otp: _token, updatedAt: new Date().toUTCString() });
        if (_updateOtp.modifiedCount !== 1) {
            return new response(609, 'Could Not Verify Email Due To A Technical Failure');
        }
        const sendemail = new sendEmail()
        await sendemail.sendButtonEmail({
            email: _profile.email,
            data: {
                token: _token,
            },
            type: enums.emailType.EMAIL_VERIFICATION
        })

        return new response(200, 'Success');
    }


    async listPlans(params: any) {
        const _profile: any = await customer.findById(params.user.userID).select('_id email planID');
        if (!_profile) {
            return new response(404, 'Record Not Found');
        }
        const plans = enums.customerMembershipPlans
        plans.forEach((plan: any) => {
            if (plan.id == _profile.planID) {
                plan.selected = true
            }
            else {
                plan.selected = false
            }
        })
        return new response(200, plans);

    }

    async updateMembership(params: any) {
        const _profile: any = await customer.findById(params.user.userID).select('_id email planID');
        if (!_profile) {
            return new response(404, 'Record Not Found');
        }
        const plans = enums.customerMembershipPlans
        let _requestedPlan: any = {}
        let _currentPlan: any = {}
        plans.forEach((plan: any) => {
            if (plan.id == params.planID) {
                _requestedPlan = plan
            }
            if (plan.id == _profile.planID) {
                _currentPlan = plan
            }
        })
        if (_currentPlan.id === _requestedPlan.id) {
            return new response(610, "Cannot Update To Same Plan");
        }
        if (_currentPlan.id === undefined) {
            _currentPlan.id = 'N/A'
        }
        if (_currentPlan.package_name === undefined) {
            _currentPlan.package_name = 'N/A'
        }
        const _selectedPlan: any = await updateMembershipRequests.findOne({ customerID: _profile._id, status: 'PENDING' });
        if (_selectedPlan) {
            if (_selectedPlan.requestedPlanID === _requestedPlan.id) {
                return new response(611, 'A Same Request Is Already In Queue');
            }
            const _updatePlan: any = await updateMembershipRequests.updateOne({ customerID: _profile._id }, {
                cuurentPlanID: _currentPlan.id,
                cuurentPlanName: _currentPlan.package_name,
                requestedPlanID: _requestedPlan.id,
                requestedPlanName: _requestedPlan.package_name,
                updatedAt: new Date().toUTCString()
            });
            if (_updatePlan.modifiedCount !== 1) {
                return new response(608, 'Could Not Process Due To A Technical Failure');
            }
        }
        else {
            const _newPlan = new updateMembershipRequests();
            _newPlan.customerID = _profile._id;
            _newPlan.customerEmail = _profile.email;
            _newPlan.cuurentPlanID = _currentPlan.id;
            _newPlan.cuurentPlanName = _currentPlan.package_name;
            _newPlan.requestedPlanID = _requestedPlan.id;
            _newPlan.requestedPlanName = _requestedPlan.package_name;
            _newPlan.isApproved = false;
            _newPlan.status = 'PENDING';
            _newPlan.createdAt = new Date().toUTCString();
            _newPlan.updatedAt = new Date().toUTCString();
            await _newPlan.save()
        }

        const sendemail = new sendEmail()
        await sendemail.sendNoButtonEmail({
            email: _profile.email,
            type: enums.emailType.UPDATE_MEMBERSHIP
        })
        await sendemail.sendEmail({ // later will change it to HTML
            email: process.env.SUPPORT_EMAIL,
            subject: "Customer Membership Update Request",
            body: `customerID: ${_profile._id}\ncustomerEmail: ${_profile.email}\ncurrentPlan: ${_currentPlan.package_name}\nrequestedPlan: ${_requestedPlan.package_name}`
        })

        return new response(200, 'Success');

    }

    async createChannelCredentials(params: any) {

        let _channel: any = channelCredentialsFactory.getChannel(params.channelName);
        if (_channel === 'invalid') return new response(400, '');
        return _channel.create(params);
    }

    async updateChannelCredentials(params: any) {

        let _channel: any = channelCredentialsFactory.getChannel(params.channelName);
        if (_channel === 'invalid') return new response(400, '');
        return _channel.update(params);
    }

    async getChannelCredentials(params: any) {

        let _channels: any = await channelCredentials.find({ customerID: params.user.userID });
        return new response(200, _channels)
    }

    async getChannelCredentialsById(params: any) {

        let _channel: any = await channelCredentials.findById(params.id);
        if (!_channel) return new response(404, '')
        if (_channel.customerID !== params.user.userID) return new response(404, '')
        return new response(200, _channel)
    }
}
export default customerModel; 