'use strict';

module.exports = {
	strToObj(str, val) {
		// eslint-disable-next-line prefer-const
		let i, obj = {}, strarr = str.split('.');
		let x = obj;
		for (i = 0; i < strarr.length - 1; i++) {
			x = x[strarr[i]] = {};
		}
		x[strarr[i]] = val;
		return obj;
	},
	getObjectByString(path, obj, separator = '.') {
		const properties = Array.isArray(path) ? path : path.split(separator);
		return properties.reduce((prev, curr) => prev?.[curr], obj);
	}
};