'use strict';

module.exports = {
	cameras: {
		isDark: {
			type: 'boolean'
		},
		lastMotion: {
			type: 'number',
			role: 'date'
		},
		lastMotionSnapshot: {
			// custom state, not include in api
			type: 'string'
		},
		lastMotionThumbnail: {
			// custom state, not include in api
			type: 'string'
		},
		host: {
			type: 'string',
			role: 'info.ip'
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
		isMotionDetected: {
			type: 'boolean'
		},
		isSmartDetected: {
			type: 'boolean'
		},
		uptime: {
			type: 'number',
			unit: 's'
		},
		lastSeen: {
			type: 'number',
			role: 'date'
		},
		stats: {
			storage: {
				used: {
					type: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1024 / 1024 / 1024) * 1000) / 1000;
					}
				}
			}
		},
		recordingSettings: {
			mode: {
				type: 'string',
				write: true,
				states: {
					always: 'always',
					schedule: 'schedule',
					never: 'never'
				}
			},
			enableMotionDetection: {
				type: 'boolean',
				write: true
			},
			useNewMotionAlgorithm: {
				type: 'boolean',
				write: true
			}
		}
	}
};