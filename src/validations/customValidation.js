const Joi = require(`joi`);

const _safeString = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.htmlStrip': '{{#label}} not contain any html tags',
    'string.withoutEquals': '{{#label}} should not contain "="',
  },
  rules: {
    htmlStrip: {
      validate(_value, _helpers) {
        const _clean = _value.replace(/(<([^>]+)>)/gi, '');
        if (_clean === _value) {
          return _clean;
        }
        return _helpers.error('string.htmlStrip');
      },
    },
    withoutEquals: {
      validate(_value, _helpers) {
        if (!_value.includes('=')) {
          return _value;
        }
        return _helpers.error('string.withoutEquals');
      },
    },
  },
}));

module.exports = {
  safeString: _safeString,
};
