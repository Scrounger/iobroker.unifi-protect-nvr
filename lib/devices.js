'use strict';

module.exports = {
	cameras: {
		isDark: {
			type: 'boolean'
		},
		lastMotion: {
			type: 'number'
		},
		host: {
			type: 'string'
		},
		mac: {
			type: 'string'
		},
		isPoorNetwork: {
			type: 'boolean'
		},
		name: {
			type: 'string'
		},
		isConnected: {
			type: 'boolean'
		},
		isRecording: {
			type: 'boolean'
		},
		uptime: {
			type: 'number',
			unit: 's'
		},
		lastSeen: {
			type: 'number'
		},
		stats: {
			storage: {
				used: {
					type: 'number',
					unit: 'GB',
					convert: function (/** @type {number} */ val) {
						return Math.round((val / 1024 / 1024 / 1024) * 1000) / 1000;
					}
				}
			}
		}
	}
};