import redis from 'redis'
import logger from '../utility/logger.js';

class cacheServer {

    client = redis.createClient({
        url: `redis://dnotifier-cache-cluster.ik24ns.ng.0001.usw2.cache.amazonaws.com:6379`,
    });

    async connectServer() {
       await this.client.connect();
        logger.log('connected with redis server');
    }

    async writeServer(key:string, data:any){
        // var _client = redis.createClient({
        //     url: `redis://dnotifier-cache-cluster.ik24ns.ng.0001.usw2.cache.amazonaws.com:6379`,
        // });
        // _client.connect();

        if(this.client.isOpen){
           var res = await this.client.set(key, JSON.stringify(data));
           logger.log('response on set:' + res)
        }else{
            logger.log('client is closed');
        }
    }

    async readServer(key:string){
        if(this.client.isOpen){
            var _res =  await this.client.get(key);
            logger.logData(_res);
            return _res;
        }
        return '';
    }


}

export default cacheServer