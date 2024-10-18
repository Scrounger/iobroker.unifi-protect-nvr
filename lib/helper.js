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
	},
	getAllowedCommonStates(path, obj, separator = '.') {
		const objByString = this.getObjectByString(path, obj, separator);
		const states = {};

		if (objByString) {
			for (const str of objByString) {
				states[str] = str;
			}

			return states;
		}

		return undefined;
	},
	getIdWithoutLastPart(id) {
		const lastIndex = id.lastIndexOf('.');
		return id.substring(0, lastIndex);
	},

	/** Compare common properties of State
	 * @param {ioBroker.StateCommon} objCommon
	 * @param {ioBroker.StateCommon} myCommon
	 * @returns {boolean}
	 */
	isStateCommonEqual(objCommon, myCommon) {
		return JSON.stringify(objCommon.name) === JSON.stringify(myCommon.name) &&
			objCommon.type === myCommon.type &&
			objCommon.read === myCommon.read &&
			objCommon.write === objCommon.write &&
			objCommon.role === myCommon.role &&
			objCommon.def === myCommon.def &&
			objCommon.unit === myCommon.unit &&
			objCommon.icon === myCommon.icon &&
			objCommon.desc == myCommon.desc &&
			objCommon.max === myCommon.max &&
			objCommon.min === myCommon.min &&
			JSON.stringify(objCommon.states) === JSON.stringify(myCommon.states);
	},

	/** Compare common properties of Channel
	 * @param {ioBroker.ChannelCommon} objCommon
	 * @param {ioBroker.ChannelCommon} myCommon
	 * @returns {boolean}
	 */
	isChannelCommonEqual(objCommon, myCommon) {
		return JSON.stringify(objCommon.name) === JSON.stringify(myCommon.name) &&
			objCommon.icon == myCommon.icon &&
			objCommon.desc === myCommon.desc &&
			objCommon.role === myCommon.role;
	}
};