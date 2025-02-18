const crypto = require('crypto');

const generateRandomCode = (length = 4) => {
  let code = '';
  for (let i = 1; i <= length; i += 1) {
    const randomValue = crypto.randomBytes(1)[0] % 10;
    code += randomValue;
  }
  return code;
};

module.exports = { generateRandomCode };
