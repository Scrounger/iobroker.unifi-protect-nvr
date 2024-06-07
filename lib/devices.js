'use strict';

// Define the bootstrap properties that should be used
// Define custom states, that are not in the bootstrap properties -> this must have an id property!

module.exports = {
	cameras: {
		id: {
			type: 'string'
		},
		displayName: {
			type: 'string'
		},
		marketName: {
			type: 'string'
		},
		isDark: {
			type: 'boolean'
		},
		lastMotion: {
			type: 'number'
		},
		lastMotionSnapshot: {
			// custom state, not include in api
			id: 'lastMotion.snapshot',
			type: 'string'
		},
		lastMotionThumbnail: {
			// custom state, not include in api
			id: 'lastMotion.thumbnail',
			type: 'string'
		},
		lastMotionThumbnailAnimated: {
			// custom state, not include in api
			id: 'lastMotion.thumbnailAnimated',
			type: 'string'
		},
		lastMotionEventId: {
			// custom id
			id: 'lastMotion.eventId',
			type: 'string'
		},
		lastMotionType: {
			// custom id
			id: 'lastMotion.type',
			type: 'string'
		},
		lastMotionStart: {
			// custom id
			id: 'lastMotion.start',
			type: 'number'
		},
		lastMotionEnd: {
			// custom id
			id: 'lastMotion.end',
			type: 'number'
		},
		lastMotionScore: {
			// custom id
			id: 'lastMotion.score',
			type: 'number'
		},
		lastMotionSmartTypes: {
			// custom id
			id: 'lastMotion.smartTypes',
			type: 'string',
			convertVal: function (/** @type {Array} */ val) {
				return val.join(',');
			}
		},
		takeSnapshot: {
			// custom state, not include in api
			id: 'takeSnapshot',
			type: 'boolean',
			role: 'button',
			read: false,
			write: true
		},
		takeSnapshotUrl: {
			// custom state, not include in api
			id: 'takeSnapshotUrl',
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
			type: 'number'
		},
		fwUpdateState: {
			type: 'string'
		},
		micVolume: {
			type: 'number',
			write: true
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