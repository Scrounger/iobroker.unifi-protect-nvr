'use strict';

// Define the bootstrap properties that should be used
// Define custom states, that are not in the bootstrap properties -> this must have an id property!

module.exports = {
	cameras: {
		id: {
			type: 'string',
			name: 'Camera Id'
		},
		displayName: {
			type: 'string',
			name: 'Camera Name'
		},
		marketName: {
			type: 'string',
			name: 'Camera Model'
		},
		isDark: {
			type: 'boolean',
			name: 'Night Vision enabled'
		},
		lastMotion: {
			type: 'number',
			name: 'Last Motion',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
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
			write: true,
			name: 'Microphone Sensitivity'
		},
		motionZones: {
			type: 'json',
			write: true,
			name: 'Edit Motion Zones',
			convertVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); } catch (ignore) { return []; }
			}
		},
		smartDetectZones: {
			type: 'json',
			write: true,
			name: 'Edit Smart Detections Zones',
			convertVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); } catch (ignore) { return []; }
			}
		},
		smartDetectLines: {
			type: 'json',
			write: true,
			name: 'Add Crossing Lines',
			convertVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); } catch (ignore) { return []; }
			}
		},
		privacyZones: {
			type: 'json',
			write: true,
			name: 'Add Privacy Zones',
			convertVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); } catch (ignore) { return []; }
			}
		},
		stats: {
			storage: {
				used: {
					type: 'number',
					unit: 'GB',
					name: 'Space used by cam',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1024 / 1024 / 1024) * 1000) / 1000;
					}
				}
			}
		},
		recordingSettings: {
			prePaddingSecs: {
				type: 'number',
				write: true,
				name: 'Seconds to record before event',
				unit: 's'
			},
			postPaddingSecs: {
				type: 'number',
				write: true,
				name: 'Seconds to record after event',
				unit: 's'
			},
			smartDetectPrePaddingSecs: {
				type: 'number',
				write: true,
				name: 'Seconds added after AI detection',
				unit: 's'
			},
			smartDetectPostPaddingSecs: {
				type: 'number',
				write: true,
				name: 'Seconds added before AI detection',
				unit: 's'
			},
			minMotionEventTrigger: {
				type: 'number',
				write: true,
				name: 'Seconds of motion needed to trigger detection',
				unit: 'ms'
			},
			// endMotionEventDelay: {
			// 	type: 'number',
			// 	write: true
			// },
			// suppressIlluminationSurge: {
			// 	type: 'boolean',
			// 	write: true
			// },
			mode: {
				type: 'string',
				write: true,
				states: {
					always: 'always',
					schedule: 'schedule',
					never: 'never'
				},
				name: 'When to Record'
			},
			inScheduleMode: {
				type: 'string',
				write: true,
				states: {
					always: 'always',
					detections: 'detections'
				},
				name: 'Within Schedule'
			},
			outScheduleMode: {
				type: 'string',
				write: true,
				states: {
					always: 'always',
					schedule: 'detections',
					never: 'never'
				},
				name: 'Outside Schedule'
			},
			enableMotionDetection: {
				type: 'boolean',
				write: true,
				name: 'Create Motion Events'
			}
		},
		smartDetectSettings: {
			objectTypes: {
				type: 'array',
				write: true,
				name: 'Video Detections Types',
				convertVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); } catch (ignore) { return []; }
				}
			},
			autoTrackingObjectTypes: {
				type: 'array',
				write: true,
				convertVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); } catch (ignore) { return []; }
				}
			},
			audioTypes: {
				type: 'array',
				write: true,
				name: 'Audio Detections Types',
				convertVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); } catch (ignore) { return []; }
				}
			}
		},
		eventStats: {
			motion: {
				today: {
					type: 'number'
				},
				average: {
					type: 'number'
				},
				lastDays: {
					type: 'array',
					convertVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					},
					writeVal: function (/** @type {string} */ val) {
						try { return JSON.parse(val); } catch (ignore) { return []; }
					}
				},
				recentHours: {
					type: 'array',
					convertVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					}
				}
			},
			smart: {
				today: {
					type: 'number'
				},
				average: {
					type: 'number'
				},
				lastDays: {
					type: 'array',
					convertVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					}
				},
			}
		}
	}
};