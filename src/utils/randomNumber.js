const crypto = require('crypto');

const generateRandomCode = (_length = 4) => {
  let _code = '';
  for (let i = 1; i <= _length; i += 1) {
    const _randomValue = crypto.randomBytes(1)[0] % 10;
    _code += _randomValue;
  }
  return _code;
};

module.exports = { generateRandomCode };
