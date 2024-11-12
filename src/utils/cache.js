require('dotenv').config();
const cacheClient = require('async-redis');
const { logger } = require('./logger');

const redisHost = process.env.REDIS_HOST;
const redisPassword = process.env.REDIS_PASSWORD;
const redisPort = process.env.REDIS_PORT;

logger.info(`> Redis Host: ${redisHost}`);

logger.info('* Using only host and port to connect to redis...');
const clientOptions = {
  host: redisHost,
  port: redisPort,
};

if (process.env.ENV === 'development') {
  clientOptions.password = redisPassword;
}

const client = cacheClient.createClient(clientOptions);

client.on('error', (err) => {
  logger.error(err.message);
});

client.on('ready', () => {
  logger.info('Redis connection successful');
});

class RedisCache {
  static set(moduleName, key, value) {
    try {
      if (typeof value !== 'string') {
        client.set(moduleName + key, JSON.stringify(value));
      } else {
        client.set(moduleName + key, value);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static setWithExpiry(moduleName, key, value, seconds) {
    try {
      if (typeof value !== 'string') {
        client.set(moduleName + key, JSON.stringify(value), 'EX', seconds);
      } else {
        client.set(moduleName + key, value, 'EX', seconds);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static setWithOriginalExpiry(moduleName, key, value) {
    try {
      if (typeof value !== 'string') {
        client.set(moduleName + key, JSON.stringify(value), 'KEEPTTL');
      } else {
        client.set(moduleName + key, value, 'KEEPTTL');
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static incrementWithOriginalExpiry(moduleName, key) {
    try {
      client.incr(moduleName + key);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async get(moduleName, key) {
    try {
      return await client.get(moduleName + key);
    } catch (error) {
      return false;
    }
  }

  static async getTTl(moduleName, key) {
    try {
      return await client.ttl(moduleName + key);
    } catch (error) {
      return false;
    }
  }

  static async del(moduleName, key) {
    try {
      return JSON.parse(await client.del(moduleName + key));
    } catch (error) {
      return false;
    }
  }

  static async insertList(moduleName, key, list) {
    try {
      await client.rpush(`${moduleName}${key}`, list);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getList(moduleName, key) {
    try {
      return await client.lrange(moduleName + key, 0, -1);
    } catch (error) {
      return false;
    }
  }

  static async getListWithModuleStart(moduleName, key = '') {
    try {
      if (key) {
        return await client.get(moduleName + key);
      }

      const pattern = `${moduleName}*`;
      const keys = [];
      let cursor = '0';

      do {
        const reply = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = reply[0];
        keys.push(...reply[1]);
      } while (cursor !== '0');

      if (keys.length > 0) {
        const values = await client.mget(keys); 
        return values;
      } else {
        return [];
      }
    } catch (error) {
      return false;
    }
  }

  static async flushAll() {
    try {
      return JSON.parse(await client.flushdb());
    } catch (error) {
      return false;
    }
  }

  static async lPush(moduleName, key, value) {
    try {
      return await client.lpush(moduleName + key, value);
    } catch (error) {
      return false;
    }
  }

  static async lRem(moduleName, key, value) {
    try {
      return await client.lrem(moduleName + key, -1, value);
    } catch (error) {
      return false;
    }
  }

  static async hmset(tableName, uniqueValue, object, expireTime) {
    try {
      await client.hmset(tableName, uniqueValue, JSON.stringify(object));
      if (expireTime) await client.expire(tableName, +expireTime);

      return true;
    } catch (err) {
      return false;
    }
  }

  static async hget(tableName, uniqueValue) {
    try {
      const result = await client.hget(tableName, uniqueValue);
      return JSON.parse(result);
    } catch (err) {
      return false;
    }
  }

  static async hdel(moduleName, key) {
    const result = await client.hdel(moduleName, key);
    return result === 1;
  }

  static async ping() {
    const pingResult = await client.ping();
    return pingResult;
  }
}
module.exports = RedisCache;
