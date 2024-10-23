import env from 'dotenv'
import response from '../utility/response.js';
env.config();

class twitterMessageModel {
    constructor() { }

    async sendMessage(params: any) {
        try {
            return new response(200, '')
        }
        catch (error:any) {
            return new response(500, JSON.stringify(error.messge))
        }

    }



}
export default twitterMessageModel; 