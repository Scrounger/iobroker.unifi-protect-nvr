'use strict';

// Define the bootstrap properties that should be used to create states
// Define custom states, that are not in the bootstrap properties -> this must have an id property!

module.exports = {
	cameras: {
		id: {
			iobType: 'string',
			name: 'Camera Id'
		},
		displayName: {
			iobType: 'string',
			name: 'Camera Name'
		},
		marketName: {
			iobType: 'string',
			name: 'Camera Model'
		},
		isDark: {
			iobType: 'boolean',
			name: 'Night Vision enabled'
		},
		lastMotion: {
			iobType: 'number',
			name: 'Last Motion',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastMotionSnapshot: {
			// custom state, not include in api
			id: 'lastMotion.snapshot',
			iobType: 'string'
		},
		lastMotionThumbnail: {
			// custom state, not include in api
			id: 'lastMotion.thumbnail',
			iobType: 'string'
		},
		lastMotionThumbnailAnimated: {
			// custom state, not include in api
			id: 'lastMotion.thumbnailAnimated',
			iobType: 'string'
		},
		lastMotionEventId: {
			// custom id
			id: 'lastMotion.eventId',
			iobType: 'string'
		},
		lastMotionType: {
			// custom id
			id: 'lastMotion.type',
			iobType: 'string'
		},
		lastMotionStart: {
			// custom id
			id: 'lastMotion.start',
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastMotionEnd: {
			// custom id
			id: 'lastMotion.end',
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastMotionScore: {
			// custom id
			id: 'lastMotion.score',
			iobType: 'number'
		},
		lastMotionSmartTypes: {
			// custom id
			id: 'lastMotion.smartTypes',
			iobType: 'string',
			hasFeature: 'featureFlags.hasSmartDetect',
			convertVal: function (/** @type {Array} */ val) {
				return val.join(',');
			}
		},
		takeSnapshot: {
			// custom state, not include in api
			id: 'takeSnapshot',
			iobType: 'boolean',
			role: 'button',
			read: false,
			write: true
		},
		takeSnapshotUrl: {
			// custom state, not include in api
			id: 'takeSnapshotUrl',
			iobType: 'string'
		},
		host: {
			iobType: 'string',
			role: 'info.ip',
			name: 'IP Address'
		},
		mac: {
			iobType: 'string'
		},
		isPoorNetwork: {
			iobType: 'boolean'
		},
		name: {
			iobType: 'string'
		},
		isConnected: {
			iobType: 'boolean'
		},
		isRecording: {
			iobType: 'boolean'
		},
		isMotionDetected: {
			iobType: 'boolean'
		},
		isSmartDetected: {
			iobType: 'boolean',
			hasFeature: 'featureFlags.hasSmartDetect',
		},
		uptime: {
			iobType: 'number',
			unit: 's',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastSeen: {
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		upSince: {
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		connectedSince: {
			iobType: 'number',
			name: 'Connected Since',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastDisconnect: {
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		fwUpdateState: {
			iobType: 'string'
		},
		state: {
			iobType: 'string'
		},
		micVolume: {
			iobType: 'number',
			write: true,
			name: 'Microphone Sensitivity',
			hasFeature: 'featureFlags.hasMic'
		},
		motionZones: {
			iobType: 'json',
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
			iobType: 'json',
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
			iobType: 'json',
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
			iobType: 'json',
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
			iobType: 'string',
			statesFromProperty: 'supportedScalingResolutions',
			name: 'Recording Resolution'
		},
		stats: {
			storage: {
				used: {
					iobType: 'number',
					unit: 'GB',
					name: 'Space used by cam',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1024 / 1024 / 1024) * 1000) / 1000;
					}
				}
			},
			wifiQuality: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasWifi'
			},
			wifiStrength: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasWifi'
			}
		},
		recordingSettings: {
			name: 'Recording Settings',
			prePaddingSecs: {
				iobType: 'number',
				write: true,
				name: 'Seconds to record before event',
				unit: 's'
			},
			postPaddingSecs: {
				iobType: 'number',
				write: true,
				name: 'Seconds to record after event',
				unit: 's'
			},
			smartDetectPrePaddingSecs: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasSmartDetect',
				write: true,
				name: 'Seconds added after AI detection',
				unit: 's'
			},
			smartDetectPostPaddingSecs: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasSmartDetect',
				write: true,
				name: 'Seconds added before AI detection',
				unit: 's'
			},
			minMotionEventTrigger: {
				iobType: 'number',
				write: true,
				name: 'Seconds of motion needed to trigger detection',
				unit: 'ms'
			},
			// endMotionEventDelay: {
			// 	iobType: 'number',
			// 	write: true
			// },
			// suppressIlluminationSurge: {
			// 	iobType: 'boolean',
			// 	write: true
			// },
			mode: {
				iobType: 'string',
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
				iobType: 'string',
				write: true,
				states: {
					always: 'always',
					detections: 'detections'
				},
				name: 'Within Schedule'
			},
			outScheduleMode: {
				// only available, if it's activate once in the app
				iobType: 'string',
				write: true,
				states: {
					always: 'always',
					never: 'never',
					detections: 'detections'
				},
				name: 'Outside Schedule'
			},
			enableMotionDetection: {
				iobType: 'boolean',
				write: true,
				name: 'Create Motion Events'
			}
		},
		smartDetectSettings: {
			hasFeature: 'featureFlags.hasSmartDetect',
			name: 'AI Events Settings',
			objectTypes: {
				iobType: 'json',
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
				iobType: 'json',
				write: true,
				convertVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); } catch (ignore) { return []; }
				}
			},
			audioTypes: {
				iobType: 'json',
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
					iobType: 'number'
				},
				average: {
					iobType: 'number'
				},
				lastDays: {
					iobType: 'json',
					convertVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					},
					writeVal: function (/** @type {string} */ val) {
						try { return JSON.parse(val); } catch (ignore) { return []; }
					}
				},
				recentHours: {
					iobType: 'json',
					convertVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					}
				}
			},
			smart: {
				hasFeature: 'featureFlags.hasSmartDetect',
				today: {
					iobType: 'number'
				},
				average: {
					iobType: 'number'
				},
				lastDays: {
					iobType: 'json',
					convertVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					}
				},
			}
		},
		osdSettings: {
			name: 'Overlay Information',
			isNameEnabled: {
				iobType: 'boolean',
				write: true,
				name: 'Camera Name'
			},
			isDateEnabled: {
				iobType: 'boolean',
				write: true,
				name: 'Time'
			},
			isLogoEnabled: {
				iobType: 'boolean',
				write: true,
				name: 'Logo'
			},
			isDebugEnabled: {
				iobType: 'boolean',
				write: true,
				name: 'Bitrate'
			}
		},
		ledSettings: {
			hasFeature: 'featureFlags.hasLedStatus',
			isEnabled: {
				iobType: 'boolean',
				write: true,
				name: 'Status Light',
			}
		},
		speakerSettings: {
			hasFeature: 'featureFlags.hasSpeaker',
			name: 'Speaker Settings',
			isEnabled: {
				iobType: 'boolean'
			},
			volume: {
				iobType: 'number',
				write: true
			}
		},
		wifiConnectionState: {
			hasFeature: 'featureFlags.hasWifi',
			name: 'Wifi Informations',
			channel: {
				iobType: 'number'
			},
			signalQuality: {
				iobType: 'number'
			},
			ssid: {
				iobType: 'string'
			},
			apName: {
				iobType: 'string'
			},
			experience: {
				iobType: 'number'
			},
			signalStrength: {
				iobType: 'number'
			}
		},
		ispSettings: {
			irLedMode: {
				iobType: 'string',
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
				iobType: 'number',
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
				iobType: 'number',
				hasFeature: 'featureFlags.canAdjustIrLedLevel'
			},
			icrSensitivity: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasIcrSensitivity'
			},
			isColorNightVisionEnabled: {
				iobType: 'boolean',
				hasFeature: 'featureFlags.hotplug.extender.hasFlash',
				write: true
			},
			spotlightDuration: {
				iobType: 'number',
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
			iobType: 'string',
			name: 'NVR Id'
		},
		host: {
			iobType: 'string',
			role: 'info.ip',
			name: 'IP Address'
		},
		hostShortname: {
			iobType: 'string'
		},
		mac: {
			iobType: 'string'
		},
		name: {
			iobType: 'string'
		},
		marketName: {
			iobType: 'string',
			name: 'NVR Model'
		},
		uptime: {
			iobType: 'number',
			unit: 's',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val / 1000);
			},
		},
		lastSeen: {
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		version: {
			iobType: 'string',
			name: 'Protect Version'
		},
		firmwareVersion: {
			iobType: 'string',
			name: 'NVR Version'
		},
		hardDriveState: {
			iobType: 'string',
			name: 'HDD Status'
		},
		isUcoreUpdatable: {
			iobType: 'boolean'
		},
		isProtectUpdatable: {
			iobType: 'boolean',
			name: 'Protect upgradable'
		},
		type: {
			iobType: 'string',
			name: 'NVR Model'
		},
		upSince: {
			iobType: 'number',
			convertVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		cameraCapacity: {
			state: {
				iobType: 'string'
			},
			qualities: {
				iobType: 'json',
				convertVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				}
			}
		},
		systemInfo: {
			name: 'System Informations',
			cpu: {
				averageLoad: {
					iobType: 'number',
					convertVal: function (/** @type {number} */ val) {
						return Math.round(val * 10) / 10;
					},
				},
				temperature: {
					iobType: 'number',
					unit: '°C',
					convertVal: function (/** @type {number} */ val) {
						return Math.round(val);
					},
				}
			},
			memory: {
				available: {
					iobType: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				},
				free: {
					iobType: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				},
				total: {
					iobType: 'number',
					unit: 'GB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				}
			},
			storage: {
				available: {
					iobType: 'number',
					unit: 'TB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				size: {
					iobType: 'number',
					unit: 'TB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				used: {
					iobType: 'number',
					unit: 'TB',
					convertVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				capability: {
					iobType: 'string'
				},
				devices: {
					iobType: 'json',
					convertVal: function (/** @type {Object} */ val) {
						return JSON.stringify(val);
					}
				}
			}
		}
	},
	users: {
		id: {
			iobType: 'string'
		},
		name: {
			iobType: 'string'
		},
		localUsername: {
			iobType: 'string'
		},
		location: {
			hasFeature: 'nvr.locationSettings.isGeofencingEnabled',
			isAway: {
				iobType: 'boolean'
			},
			homeAwaySince: {
				iobType: 'number'
			},
			latitude: {
				iobType: 'number'
			},
			longitude: {
				iobType: 'number'
			}
		}
	}
};