import { randomUUID } from "crypto";
import user from "../entity/user.js";
import response from "../utility/response.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import logger from "../utility/logger.js";

class userModel{
    constructor(){}

    validateSignUp(params:any){
        if(params.username == undefined || params.username == '' 
        || params.password == undefined || params.password == ''){
            return new response(600,'JOI Validation Error');
        }
        return new response(200,'Success');
    }

   async signin(params:any){
        const _result:any = await user.findOne({username:params.username}).select('_id username password');
        if(_result){
            logger.log('user found. comparing pass hash')
            if(await bcrypt.compare(params.password, _result.password)){
                const _key:string = process.env.TOKEN_KEY?process.env.TOKEN_KEY : ''
                const _token = jwt.sign(
                    { userID : _result.id, username : _result.username},
                    _key,
                    {expiresIn: "2h"}
                )

                return new response(200,_token);
            }
        }
        return new response(404,'Record Not Found');
    }

    async signup(params:any){
        const _hash = bcrypt.hashSync(params.password,bcrypt.genSaltSync());

        const _profile = new user();
        _profile.username = params.username;
        _profile.password = _hash
        _profile.pushID = params.pushID;
        _profile.createdAt = new Date().toUTCString();
        _profile.updatedAt = new Date().toUTCString();

        await _profile.save();
        
        return new response(201,'Record Created Successfully');
    }


}
export default userModel; 