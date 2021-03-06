'use strict';
const path = require('path');
const {promisify} = require('util');
const childProcess = require('child_process');

const execFile = promisify(childProcess.execFile);
const bin = path.join(__dirname, '../main');

const parseMac = stdout => {
	try {
		const result = JSON.parse(stdout);
		if (result !== null) {
			result.platform = 'macos';
			return result;
		}
	} catch (error) {
		console.error(error);
		throw new Error('Error parsing window data');
	}
};

const getArguments = options => {
	if (!options) {
		return [];
	}

	const args = [];
	if (options.accessibilityCheck === false) {
		args.push('--no-accessibility-check');
	}

	if (options.screenRecordingCheck === false) {
		args.push('--no-screen-recording-check');
	}

	if (options.url === false) {
		args.push('--no-url');
	}

	return args;
};

module.exports = async options => {
	const {stdout} = await execFile(bin, getArguments(options));
	return parseMac(stdout);
};

module.exports.sync = options => {
	const stdout = childProcess.execFileSync(bin, getArguments(options), {encoding: 'utf8'});
	return parseMac(stdout);
};
