const crypto = require('crypto');

function generateCryptoRandom() {
  const _buffer = crypto.randomBytes(4);
  const _randomNumber = _buffer.readUInt32BE(0);
  return _randomNumber / 0xffffffff;
}

const shuffleList = (_data) => {
  _data.sort(() => generateCryptoRandom() - 0.5);
};

const shuffleAndReturnList = (_list) =>
  _list
    .map((_value) => ({ _value, sort: crypto.randomInt(0, _list.length) }))
    .sort((_a, _b) => _a.sort - _b.sort)
    .map(({ value }) => value);

const shuffleLevel = (_level) => [
  ..._level
    .slice(0, -1)
    .map((_value) => ({ _value, sort: crypto.randomInt(0, _level.length) }))
    .sort((_a, _b) => _a.sort - _b.sort)
    .map(({ value }) => value),
  _level[_level.length - 1],
];

module.exports = { shuffleList, shuffleLevel, shuffleAndReturnList };
