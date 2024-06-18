'use strict';

// Define the bootstrap properties that should be used to create states
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
			type: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastMotionEnd: {
			// custom id
			id: 'lastMotion.end',
			type: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
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
			hasFeature: 'featureFlags.hasSmartDetect',
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
			role: 'info.ip',
			name: 'IP Address'
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
			type: 'boolean',
			hasFeature: 'featureFlags.hasSmartDetect',
		},
		uptime: {
			type: 'number',
			unit: 's'
		},
		lastSeen: {
			type: 'number'
		},
		upSince: {
			type: 'number'
		},
		connectedSince: {
			type: 'number',
			name: 'Connected Since'
		},
		lastDisconnect: {
			type: 'number'
		},
		fwUpdateState: {
			type: 'string'
		},
		state: {
			type: 'string'
		},
		micVolume: {
			type: 'number',
			write: true,
			name: 'Microphone Sensitivity',
			hasFeature: 'featureFlags.hasMic'
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
			hasFeature: 'featureFlags.hasSmartDetect',
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
			hasFeature: 'featureFlags.hasLineCrossing',
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
			hasFeature: 'featureFlags.hasPrivacyMask',
			convertVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); } catch (ignore) { return []; }
			}
		},
		currentResolution: {
			// should be write able, but doesn't work
			type: 'string',
			statesFromProperty: 'supportedScalingResolutions',
			name: 'Recording Resolution'
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
			},
			wifiQuality: {
				type: 'number',
				hasFeature: 'featureFlags.hasWifi'
			},
			wifiStrength: {
				type: 'number',
				hasFeature: 'featureFlags.hasWifi'
			}
		},
		recordingSettings: {
			name: 'Recording Settings',
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
				hasFeature: 'featureFlags.hasSmartDetect',
				write: true,
				name: 'Seconds added after AI detection',
				unit: 's'
			},
			smartDetectPostPaddingSecs: {
				type: 'number',
				hasFeature: 'featureFlags.hasSmartDetect',
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
					never: 'never',
					detections: 'detections'
				},
				name: 'When to Record'
			},
			inScheduleMode: {
				// only available, if it's activate once in the app
				type: 'string',
				write: true,
				states: {
					always: 'always',
					detections: 'detections'
				},
				name: 'Within Schedule'
			},
			outScheduleMode: {
				// only available, if it's activate once in the app
				type: 'string',
				write: true,
				states: {
					always: 'always',
					never: 'never',
					detections: 'detections'
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
			hasFeature: 'featureFlags.hasSmartDetect',
			name: 'AI Events Settings',
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
			name: 'Events Statistics',
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
				hasFeature: 'featureFlags.hasSmartDetect',
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
		},
		osdSettings: {
			name: 'Overlay Information',
			isNameEnabled: {
				type: 'boolean',
				write: true,
				name: 'Camera Name'
			},
			isDateEnabled: {
				type: 'boolean',
				write: true,
				name: 'Time'
			},
			isLogoEnabled: {
				type: 'boolean',
				write: true,
				name: 'Logo'
			},
			isDebugEnabled: {
				type: 'boolean',
				write: true,
				name: 'Bitrate'
			}
		},
		ledSettings: {
			hasFeature: 'featureFlags.hasLedStatus',
			isEnabled: {
				type: 'boolean',
				write: true,
				name: 'Status Light',
			}
		},
		speakerSettings: {
			hasFeature: 'featureFlags.hasSpeaker',
			name: 'Speaker Settings',
			isEnabled: {
				type: 'boolean'
			},
			volume: {
				type: 'number',
				write: true
			}
		},
		wifiConnectionState: {
			hasFeature: 'featureFlags.hasWifi',
			name: 'Wifi Informations',
			channel: {
				type: 'number'
			},
			signalQuality: {
				type: 'number'
			},
			ssid: {
				type: 'string'
			},
			apName: {
				type: 'string'
			},
			experience: {
				type: 'number'
			},
			signalStrength: {
				type: 'number'
			}
		},
		ispSettings: {
			irLedMode: {
				type: 'string',
				name: 'Night Vision',
				hasFeature: 'featureFlags.hasLedIr',
				states: {
					auto: 'auto',
					custom: 'custom',
					customFilterOnly: 'customFilterOnly',
					on: 'on',
					off: 'off'
				},
				write: true
			},
			icrCustomValue: {
				type: 'number',
				name: 'Night Vision - Trigger Threshold',
				hasFeature: 'featureFlags.hasLuxCheck',
				min: 0,
				max: 10,
				states: {
					0: '< 1',
					1: 1,
					2: 3,
					3: 5,
					4: 7,
					5: 10,
					6: 12,
					7: 15,
					8: 20,
					9: 25,
					10: 30
				},
				unit: 'Lux',
				write: true
			},
			irLedLevel: {
				type: 'number',
				hasFeature: 'featureFlags.canAdjustIrLedLevel'
			},
			icrSensitivity: {
				type: 'number',
				hasFeature: 'featureFlags.hasIcrSensitivity'
			},
			isColorNightVisionEnabled: {
				type: 'boolean',
				hasFeature: 'featureFlags.hotplug.extender.hasFlash',
				write: true
			},
			spotlightDuration: {
				type: 'number',
				hasFeature: 'featureFlags.hotplug.extender.hasFlash',
				states: {
					5: 5,
					15: 15,
					30: 30,
					45: 45,
					60: 60
				},
				unit: 's',
				write: true,
			}
		}
	},
	nvr: {
		id: {
			type: 'string',
			name: 'NVR Id'
		},
		host: {
			type: 'string',
			role: 'info.ip',
			name: 'IP Address'
		},
		mac: {
			type: 'string'
		},
		name: {
			type: 'string'
		},
		marketName: {
			type: 'string',
			name: 'NVR Model'
		},
		uptime: {
			type: 'number',
			unit: 's',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val / 1000);
			},
		},
		lastSeen: {
			type: 'number'
		},
		version: {
			type: 'string',
			name: 'Protect Version'
		},
		firmwareVersion: {
			type: 'string',
			name: 'NVR Version'
		},
		hardDriveState: {
			type: 'string',
			name: 'HDD Status'
		},
		isProtectUpdatable: {
			type: 'string',
			name: 'Protect upgradable'
		},
		type: {
			type: 'string',
			name: 'NVR Model'
		},
		upSince: {
			type: 'number'
		},
		isAway: {
			type: 'boolean',
		},
		systemInfo: {
			name: 'System Informations',
			cpu: {
				averageLoad: {
					type: 'number',
					convertVal: function (/** @type {number} */ val) {
						return Math.round(val * 10) / 10;
					},
				},
				temperature: {
					type: 'number',
					unit: '°C',
					convertVal: function (/** @type {number} */ val) {
						return Math.round(val);
					},
				}
			},
			memory: {
				available: {
					type: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				},
				free: {
					type: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				},
				total: {
					type: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				}
			},
			storage: {
				available: {
					type: 'number',
					unit: 'TB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				size: {
					type: 'number',
					unit: 'TB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				used: {
					type: 'number',
					unit: 'TB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				capability: {
					type: 'string'
				},
				devices: {
					type: 'json',
					convertVal: function (/** @type {Object} */ val) {
						return JSON.stringify(val);
					}
				}
			}
		}
	},
	users: {
		id: {
			type: 'string'
		},
		name: {
			type: 'string'
		},
		localUsername: {
			type: 'string'
		},
		location: {
			hasFeature: 'nvr.locationSettings.isGeofencingEnabled',
			isAway: {
				type: 'boolean'
			},
			homeAwaySince: {
				type: 'number'
			},
			latitude: {
				type: 'number'
			},
			longitude: {
				type: 'number'
			}
		}
	}
};