require('dotenv').config();
const _cacheClient = require('async-redis');
const { logger } = require('./logger');

const _redisHost = process.env.REDIS_HOST;
const _redisPassword = process.env.REDIS_PASSWORD;
const _redisPort = process.env.REDIS_PORT;

logger.info(`> Redis Host: ${_redisHost}`);

logger.info('* Using only host and port to connect to redis...');
const _clientOptions = {
  host: _redisHost,
  port: _redisPort,
};

if (process.env.ENV === 'development') {
  _clientOptions.password = _redisPassword;
}

const _client = _cacheClient.createClient(_clientOptions);

_client.on('error', (_error) => {
  logger.error(_error.message);
});

_client.on('ready', () => {
  logger.info('Redis connection successful');
});

class RedisCache {
  static set(_moduleName, _key, _value) {
    try {
      if (typeof _value !== 'string') {
        _client.set(_moduleName + _key, JSON.stringify(_value));
      } else {
        _client.set(_moduleName + _key, _value);
      }
      return true;
    } catch (_error) {
      logger.info('====> REDIS ERROR SET');
      logger.info(_error);
      return false;
    }
  }

  static setWithExpiry(_moduleName, _key, _value, _seconds) {
    try {
      if (typeof _value !== 'string') {
        _client.set(_moduleName + _key, JSON.stringify(_value), 'EX', _seconds);
      } else {
        _client.set(_moduleName + _key, _value, 'EX', _seconds);
      }
      return true;
    } catch (_error) {
      logger.info('====> REDIS ERROR SETWITHEXPIRY');
      logger.info(_error);
      return false;
    }
  }

  static setWithOriginalExpiry(_moduleName, _key, _value) {
    try {
      if (typeof _value !== 'string') {
        _client.set(_moduleName + _key, JSON.stringify(_value), 'KEEPTTL');
      } else {
        _client.set(_moduleName + _key, _value, 'KEEPTTL');
      }
      return true;
    } catch (_error) {
      logger.info('====> REDIS ERROR SETWITHORIGINALEXPIRY');
      logger.info(_error);
      return false;
    }
  }

  static incrementWithOriginalExpiry(_moduleName, _key) {
    try {
      _client.incr(_moduleName + _key);
      return true;
    } catch (_error) {
      logger.info('====> REDIS ERROR INCREMENTWITHORIGINALEXPIRY');
      logger.info(_error);
      return false;
    }
  }

  static async get(_moduleName, _key) {
    try {
      return await _client.get(_moduleName + _key);
    } catch (_error) {
      logger.info('====> REDIS ERROR GET');
      logger.info(_error);
      return false;
    }
  }

  static async getTTl(_moduleName, _key) {
    try {
      return await _client.ttl(_moduleName + _key);
    } catch (_error) {
      logger.info('====> REDIS ERROR GETTTL');
      logger.info(_error);
      return false;
    }
  }

  static async del(_moduleName, _key) {
    try {
      return JSON.parse(await _client.del(_moduleName + _key));
    } catch (_error) {
      logger.info('====> REDIS ERROR DEL');
      logger.info(_error);
      return false;
    }
  }

  static async insertList(_moduleName, _key, _list) {
    try {
      await _client.rpush(`${_moduleName}${_key}`, _list);
      return true;
    } catch (_error) {
      logger.info('====> REDIS ERROR INSERTLIST');
      logger.info(_error);
      return false;
    }
  }

  static async getList(_moduleName, _key) {
    try {
      return await _client.lrange(_moduleName + _key, 0, -1);
    } catch (_error) {
      logger.info('====> REDIS ERROR GETLIST');
      logger.info(_error);
      return false;
    }
  }

  static async getListWithModuleStart(_moduleName, _key = '') {
    try {
      if (_key) {
        return await _client.get(_moduleName + _key);
      }

      const _pattern = `${_moduleName}*`;
      const _keys = [];
      let _cursor = '0';

      do {
        const _reply = await _client.scan(
          _cursor,
          'MATCH',
          _pattern,
          'COUNT',
          100
        );
        _cursor = _reply[0];
        _keys.push(..._reply[1]);
      } while (_cursor !== '0');

      if (_keys.length > 0) {
        const _values = await _client.mget(_keys);
        return _values;
      } else {
        return [];
      }
    } catch (_error) {
      logger.info('====> REDIS ERROR GETLISTWITHMODULESTART');
      logger.info(_error);
      return false;
    }
  }

  static async flushAll() {
    try {
      return JSON.parse(await _client.flushdb());
    } catch (_error) {
      logger.info('====> REDIS ERROR FLUSHALL');
      logger.info(_error);
      return false;
    }
  }

  static async lPush(_moduleName, _key, _value) {
    try {
      return await _client.lpush(_moduleName + _key, _value);
    } catch (_error) {
      logger.info('====> REDIS ERROR LPUSH');
      logger.info(_error);
      return false;
    }
  }

  static async lRem(_moduleName, _key, _value) {
    try {
      return await _client.lrem(_moduleName + _key, -1, _value);
    } catch (_error) {
      logger.info('====> REDIS ERROR LREM');
      logger.info(_error);
      return false;
    }
  }

  static async hmset(_tableName, _uniqueValue, _object, _expireTime) {
    try {
      await _client.hmset(_tableName, _uniqueValue, JSON.stringify(_object));
      if (_expireTime) await _client.expire(_tableName, +_expireTime);

      return true;
    } catch (_error) {
      logger.info('====> REDIS ERROR HMSET');
      logger.info(_error);
      return false;
    }
  }

  static async hget(_tableName, _uniqueValue) {
    try {
      const _result = await _client.hget(_tableName, _uniqueValue);
      return JSON.parse(_result);
    } catch (_error) {
      logger.info('====> REDIS ERROR HGET');
      logger.info(_error);
      return false;
    }
  }

  static async hdel(_moduleName, _key) {
    try {
      const _result = await _client.hdel(_moduleName, _key);
      return _result === 1;
    } catch (_error) {
      logger.info('====> REDIS ERROR HDEL');
      logger.info(_error);
      return false;
    }
  }

  static async ping() {
    try {
      const _pingResult = await _client.ping();
      return _pingResult;
    } catch (_error) {
      logger.info('====> REDIS ERROR PING');
      logger.info(_error);
      return false;
    }
  }
}
module.exports = RedisCache;
