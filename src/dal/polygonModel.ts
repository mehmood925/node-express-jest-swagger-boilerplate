import response from "../utility/response.js";
import env from 'dotenv'
env.config();

class polygonModel {
    constructor() { }

    async scan(params: any) {

      
        return new response(201, 'Record Created Successfully');
    }
}
export default polygonModel; 