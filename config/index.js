const defaultConfig = require('./default');
const dev = require('./dev');

const configHolder = { defaultConfig, dev };

const getValue = (obj, path) => {
	for (let i = 0, parts = path.split('.'), len = parts.length; obj != undefined && i < len; i++) {
		obj = obj[parts[i]];
	}
	return obj;
};

module.exports = {
	get: (path, stage = process.env.FUNCTIONAL_STAGE) => {
		let config = configHolder[stage];
		let value = undefined;

		if (config) {
			value = getValue(config, path);
		}

		if (value == undefined) {
			value = getValue(configHolder['defaultConfig'], path);
		}

		return value;
	}
};