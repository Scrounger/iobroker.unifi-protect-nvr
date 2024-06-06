'use strict';

// Define the bootstrap properties that should be used
// Define custom states, that are not in the bootstrap properties -> this must have an id property!

module.exports = {
	cameras: {
		isDark: {
			type: 'boolean'
		},
		lastMotion: {
			type: 'number'
		},
		lastMotionSnapshot: {
			// custom state, not include in api
			id: 'lastMotionSnapshot',
			type: 'string'
		},
		lastMotionThumbnail: {
			// custom state, not include in api
			id: 'lastMotionThumbnail',
			type: 'string'
		},
		lastMotionType: {
			// custom state, not include in api
			id: 'lastMotionType',
			type: 'string'
		},
		lastMotionStart: {
			// custom state, not include in api
			id: 'lastMotionStart',
			type: 'number'
		},
		lastMotionEnd: {
			// custom state, not include in api
			id: 'lastMotionEnd',
			type: 'number'
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
			type: 'number'
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