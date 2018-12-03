const defaultConfig = require('./default');
const dev = require('./dev');

const configHolder = { defaultConfig, dev };

const getValue = (obj, path) => {
  let value = {};
  // eslint-disable-next-line no-plusplus
  for (let i = 0, parts = path.split('.'), len = parts.length; obj !== undefined && i < len; i++) {
    value = obj[parts[i]];
  }
  return value;
};

module.exports = {
  get: (path, stage = process.env.FUNCTIONAL_STAGE) => {
    const config = configHolder[stage];
    let value;

    if (config) {
      value = getValue(config, path);
    }

    if (value === undefined) {
      value = getValue(configHolder.defaultConfig, path);
    }

    return value;
  },
};
