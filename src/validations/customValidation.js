const Joi = require(`joi`);

const safeString = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.htmlStrip': '{{#label}} not contain any html tags',
    'string.withoutEquals': '{{#label}} should not contain "="',
  },
  rules: {
    htmlStrip: {
      validate(value, helpers) {
        const clean = value.replace(/(<([^>]+)>)/gi, '');
        if (clean === value) {
          return clean;
        }
        return helpers.error('string.htmlStrip');
      },
    },
    withoutEquals: {
      validate(value, helpers) {
        if (!value.includes('=')) {
          return value;
        }
        return helpers.error('string.withoutEquals');
      },
    },
  },
}));

module.exports = {
  safeString,
};
