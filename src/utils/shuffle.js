const crypto = require('crypto');

function generateCryptoRandom() {
  const buffer = crypto.randomBytes(4);
  const randomNumber = buffer.readUInt32BE(0);
  return randomNumber / 0xffffffff;
}

const shuffleList = (data) => {
  data.sort(() => generateCryptoRandom() - 0.5);
};

const shuffleAndReturnList = (list) =>
  list
    .map((value) => ({ value, sort: crypto.randomInt(0, list.length) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const shuffleLevel = (level) => [
  ...level
    .slice(0, -1)
    .map((value) => ({ value, sort: crypto.randomInt(0, level.length) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value),
  level[level.length - 1],
];

module.exports = { shuffleList, shuffleLevel, shuffleAndReturnList };
