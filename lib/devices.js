'use strict';

// Define the bootstrap properties that should be used to create states
//
// Possible properties:
// iobType: iobroker type definition
// all iobroker common properties are allowed
// id: if it's a custom state that is not include in bootstrap (perhaps you have to handle this explicte in main.js)
// readVal: function to convert val after reading
// writeVal: function to convert val before writing
// hasFeature: check bootstrap if feature is available for device (otherwise state will not be created)
// statesFromProperty: common.states properties are taken from bootstrap property value

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
		type: {
			iobType: 'string',
			name: 'Camera Type'
		},
		isDark: {
			iobType: 'boolean',
			name: 'Night Vision enabled'
		},
		lastMotion: {
			iobType: 'number',
			name: 'Last Motion',
			readVal: function (/** @type {number} */ val) {
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
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastMotionEnd: {
			// custom id
			id: 'lastMotion.end',
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
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
			readVal: function (/** @type {Array} */ val) {
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
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastSeen: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		upSince: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		connectedSince: {
			iobType: 'number',
			name: 'Connected Since',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastDisconnect: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		fwUpdateState: {
			iobType: 'string',
			states: {
				updateAvailable: 'updateAvailable',
				preparing: 'preparing',
				downloading: 'downloading',
				updating: 'updating',
				upToDate: 'upToDate'
			},
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
			readVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); }
				// eslint-disable-next-line no-unused-vars
				catch (ignore) { return []; }
			}
		},
		smartDetectZones: {
			iobType: 'json',
			write: true,
			name: 'Edit Smart Detections Zones',
			hasFeature: 'featureFlags.hasSmartDetect',
			readVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); }
				// eslint-disable-next-line no-unused-vars
				catch (ignore) { return []; }
			}
		},
		smartDetectLines: {
			iobType: 'json',
			write: true,
			name: 'Add Crossing Lines',
			hasFeature: 'featureFlags.hasLineCrossing',
			readVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); }
				// eslint-disable-next-line no-unused-vars
				catch (ignore) { return []; }
			}
		},
		privacyZones: {
			iobType: 'json',
			write: true,
			name: 'Add Privacy Zones',
			hasFeature: 'featureFlags.hasPrivacyMask',
			readVal: function (/** @type {Object} */ val) {
				return JSON.stringify(val);
			},
			writeVal: function (/** @type {string} */ val) {
				try { return JSON.parse(val); }
				// eslint-disable-next-line no-unused-vars
				catch (ignore) { return []; }
			}
		},
		currentResolution: {
			// should be write able, but doesn't work
			iobType: 'string',
			statesFromProperty: 'supportedScalingResolutions',
			name: 'Recording Resolution'
		},
		videoMode: {
			iobType: 'string',
			name: 'Shutter Exposure',
			statesFromProperty: 'featureFlags.videoModes',
			write: true
		},
		stats: {
			storage: {
				used: {
					iobType: 'number',
					unit: 'GB',
					name: 'Space used by cam',
					readVal: function (/** @type {number} */ val) {
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
				unit: 's',
				min: 0,
				max: 10,
				step: 1
			},
			postPaddingSecs: {
				iobType: 'number',
				write: true,
				name: 'Seconds to record after event',
				unit: 's',
				min: 0,
				max: 10,
				step: 1
			},
			smartDetectPrePaddingSecs: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasSmartDetect',
				write: true,
				name: 'Seconds added after AI detection',
				unit: 's',
				min: 0,
				max: 10,
				step: 1
			},
			smartDetectPostPaddingSecs: {
				iobType: 'number',
				hasFeature: 'featureFlags.hasSmartDetect',
				write: true,
				name: 'Seconds added before AI detection',
				unit: 's',
				min: 0,
				max: 10,
				step: 1
			},
			minMotionEventTrigger: {
				iobType: 'number',
				write: true,
				name: 'Seconds of motion needed to trigger detection',
				unit: 'ms',
				min: 1000,
				max: 5000,
				step: 500
			},
			endMotionEventDelay: {
				iobType: 'number',
				write: true
			},
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
				name: 'Record Motion Events'
			}
		},
		smartDetectSettings: {
			hasFeature: 'featureFlags.hasSmartDetect',
			name: 'AI Events Settings',
			objectTypes: {
				iobType: 'json',
				write: true,
				name: 'Video Detections Types',
				readVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); }
					// eslint-disable-next-line no-unused-vars
					catch (ignore) { return []; }
				}
			},
			autoTrackingObjectTypes: {
				iobType: 'json',
				write: true,
				readVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); }
					// eslint-disable-next-line no-unused-vars
					catch (ignore) { return []; }
				}
			},
			audioTypes: {
				iobType: 'json',
				write: true,
				name: 'Audio Detections Types',
				readVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				},
				writeVal: function (/** @type {string} */ val) {
					try { return JSON.parse(val); }
					// eslint-disable-next-line no-unused-vars
					catch (ignore) { return []; }
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
					readVal: function (/** @type {Array} */ val) {
						return JSON.stringify(val);
					},
					writeVal: function (/** @type {string} */ val) {
						try { return JSON.parse(val); }
						// eslint-disable-next-line no-unused-vars
						catch (ignore) { return []; }
					}
				},
				recentHours: {
					iobType: 'json',
					readVal: function (/** @type {Array} */ val) {
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
					readVal: function (/** @type {Array} */ val) {
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
			},
			brightness: {
				iobType: 'number',
				name: 'Brightness',
				write: true,
				unit: '%',
				min: 0,
				max: 100,
				step: 1
			},
			contrast: {
				iobType: 'number',
				name: 'Contrast',
				write: true,
				unit: '%',
				min: 0,
				max: 100,
				step: 1
			},
			hue: {
				iobType: 'number',
				name: 'Hue',
				write: true,
				unit: '%',
				min: 0,
				max: 100,
				step: 1
			},
			saturation: {
				iobType: 'number',
				name: 'Saturation',
				write: true,
				unit: '%',
				min: 0,
				max: 100,
				step: 1
			},
			sharpness: {
				iobType: 'number',
				name: 'Sharpness',
				write: true,
				unit: '%',
				min: 0,
				max: 100,
				step: 1
			},
			denoise: {
				iobType: 'number',
				name: 'Denoise',
				write: true,
				unit: '%',
				min: 0,
				max: 100,
				step: 1
			},
			isAutoRotateEnabled: {
				hasFeature: 'featureFlags.hasVerticalFlip',
				iobType: 'boolean',
				name: 'AutoRotate',
				write: true
			},
			isFlippedVertical: {
				hasFeature: 'featureFlags.hasVerticalFlip',
				iobType: 'boolean',
				name: 'Vertical Flip',
				write: true
			},
			isFlippedHorizontal: {
				iobType: 'boolean',
				name: 'Horizontal Flip',
				write: true
			},
			hdrMode: {
				hasFeature: 'featureFlags.hasHdr',
				iobType: 'string',
				name: 'HDR',
				write: true,
				states: {
					normal: 'Auto',
					superHdr: 'Always On'
				},
			},
			// aeMode: {
			// 	iobType: 'string',
			// 	write: true,
			// }
			// icrSwitchMode: {
			// 	iobType: 'string',
			// 	write: true,
			// },
			// wdr: {
			// 	iobType: 'number',
			// 	write: true,
			// }
		},
		channels: {
			isArray: true,
			items: {
				id: {
					iobType: 'number'
				},
				videoId: {
					iobType: 'string'
				},
				name: {
					iobType: 'string'
				},
				width: {
					iobType: 'number'
				},
				height: {
					iobType: 'number'
				},
				fps: {
					iobType: 'number'
				},
				rtspAlias: {
					iobType: 'string'
				},
				// streamStart: {
				// 	id: 'streamStart',
				// 	iobType: 'boolean',
				// 	role: 'button',
				// 	read: false,
				// 	write: true
				// },
				// streamStop: {
				// 	id: 'streamStop',
				// 	iobType: 'boolean',
				// 	role: 'button',
				// 	read: false,
				// 	write: true
				// },
				// streamUrl: {
				// 	id: 'streamUrl',
				// 	iobType: 'string'
				// }
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
			readVal: function (/** @type {number} */ val) {
				return Math.round(val / 1000);
			},
		},
		lastSeen: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
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
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		cameraCapacity: {
			state: {
				iobType: 'string'
			},
			qualities: {
				iobType: 'json',
				readVal: function (/** @type {Array} */ val) {
					return JSON.stringify(val);
				}
			}
		},
		systemInfo: {
			name: 'System Informations',
			cpu: {
				averageLoad: {
					iobType: 'number',
					readVal: function (/** @type {number} */ val) {
						return Math.round(val * 10) / 10;
					},
				},
				temperature: {
					iobType: 'number',
					unit: '°C',
					readVal: function (/** @type {number} */ val) {
						return Math.round(val);
					},
				}
			},
			memory: {
				available: {
					iobType: 'number',
					unit: 'GB',
					readVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				},
				free: {
					iobType: 'number',
					unit: 'GB',
					readVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				},
				total: {
					iobType: 'number',
					unit: 'GB',
					readVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000) * 100) / 100;
					},
				}
			},
			storage: {
				available: {
					iobType: 'number',
					unit: 'TB',
					readVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				size: {
					iobType: 'number',
					unit: 'TB',
					readVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				used: {
					iobType: 'number',
					unit: 'TB',
					readVal: function (/** @type {number} */ val) {
						return Math.round((val / 1000 / 1000 / 1000 / 1000) * 1000) / 1000;
					},
				},
				capability: {
					iobType: 'string'
				},
				devices: {
					iobType: 'json',
					readVal: function (/** @type {Object} */ val) {
						return JSON.stringify(val);
					}
				}
			}
		},
		locationSettings: {
			isGeofencingEnabled: {
				iobType: 'boolean',
				write: true
			},
			// radius: {
			// 	iobType: 'number',
			// 	write: true
			// },
			// latitude: {
			// 	iobType: 'number',
			// 	write: true
			// },
			// longitude: {
			// 	iobType: 'number',
			// 	write: true
			// }
		},
		// globalCameraSettings: {
		// 	osdSettings: {
		// 		name: 'Overlay Information',
		// 		isNameEnabled: {
		// 			iobType: 'boolean',
		// 			write: true,
		// 			name: 'Camera Name'
		// 		},
		// 		isDateEnabled: {
		// 			iobType: 'boolean',
		// 			write: true,
		// 			name: 'Time'
		// 		},
		// 		isLogoEnabled: {
		// 			iobType: 'boolean',
		// 			write: true,
		// 			name: 'Logo'
		// 		},
		// 		isDebugEnabled: {
		// 			iobType: 'boolean',
		// 			write: true,
		// 			name: 'Bitrate'
		// 		}
		// 	}
		// }
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
		// lastLoginIp: {
		// 	iobType: 'string'
		// },
		// lastLoginTime: {
		// 	iobType: 'number',
		// 	readVal: function (/** @type {number} */ val) {
		// 		return Math.round(val);
		// 	}
		// },
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
	},
	sensors: {
		id: {
			iobType: 'string',
			name: 'Sensor Id'
		},
		displayName: {
			iobType: 'string',
			name: 'Sensor Name'
		},
		marketName: {
			iobType: 'string',
			name: 'Sensor Model'
		},
		type: {
			iobType: 'string',
			name: 'Sensor Type'
		},
		mac: {
			iobType: 'string'
		},
		name: {
			iobType: 'string'
		},
		state: {
			iobType: 'string'
		},
		isConnected: {
			iobType: 'boolean'
		},
		uptime: {
			iobType: 'number',
			unit: 's',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastSeen: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		upSince: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		connectedSince: {
			iobType: 'number',
			name: 'Connected Since',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		lastDisconnect: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		isMotionDetected: {
			iobType: 'boolean'
		},
		motionDetectedAt: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		motionSettings: {
			isEnabled: {
				iobType: 'boolean',
				write: true,
			},
			sensitivity: {
				iobType: 'number',
				write: true,
				min: 1,
				max: 100,
				step: 1,
				unit: '%'
			}
		},
		isOpened: {
			iobType: 'boolean'
		},
		openStatusChangedAt: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		firmwareVersion: {
			iobType: 'string'
		},
		alarmTriggeredAt: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		alarmSettings: {
			isEnabled: {
				iobType: 'boolean',
				write: true
			}
		},
		leakDetectedAt: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		tamperingDetectedAt: {
			iobType: 'number',
			readVal: function (/** @type {number} */ val) {
				return Math.round(val);
			},
		},
		fwUpdateState: {
			iobType: 'string',
			states: {
				updateAvailable: 'updateAvailable',
				preparing: 'preparing',
				downloading: 'downloading',
				updating: 'updating',
				upToDate: 'upToDate'
			},
		},
		bluetoothConnectionState: {
			signalQuality: {
				iobType: 'number',
				unit: '%'
			},
			signalStrength: {
				iobType: 'number',
				unit: 'dBm'
			}
		},
		batteryStatus: {
			percentage: {
				iobType: 'number',
				unit: '%'
			},
			isLow: {
				iobType: 'boolean',
			}
		},
		stats: {
			light: {
				value: {
					iobType: 'number',
					unit: 'lux'
				},
				status: {
					iobType: 'string',
					states: {
						high: 'high',
						neutral: 'neutral',
						low: 'low'
					},
				}
			},
			humidity: {
				value: {
					iobType: 'number',
					unit: '%'
				},
				status: {
					iobType: 'string',
					states: {
						high: 'high',
						neutral: 'neutral',
						low: 'low'
					},
				}
			},
			temperature: {
				value: {
					iobType: 'number',
					unit: '°C'
				},
				status: {
					iobType: 'string',
					states: {
						high: 'high',
						neutral: 'neutral',
						low: 'low'
					},
				}
			},
		},
		lightSettings: {
			isEnabled: {
				iobType: 'boolean',
				write: true,
			},
			lowThreshold: {
				iobType: 'number',
				write: true,
				min: 1,
				max: 1000,
				step: 1,
				unit: 'lux'
			},
			highThreshold: {
				iobType: 'number',
				write: true,
				min: 1,
				max: 1000,
				step: 1,
				unit: 'lux'
			}
		},
		temperatureSettings: {
			isEnabled: {
				iobType: 'boolean',
				write: true,
			},
			lowThreshold: {
				iobType: 'number',
				write: true,
				min: 0,
				max: 45,
				step: 1,
				unit: '°C'
			},
			highThreshold: {
				iobType: 'number',
				write: true,
				min: 0,
				max: 45,
				step: 1,
				unit: '°C'
			}
		},
		humiditySettings: {
			isEnabled: {
				iobType: 'boolean',
				write: true,
			},
			lowThreshold: {
				iobType: 'number',
				write: true,
				min: 1,
				max: 99,
				step: 1,
				unit: '%'
			},
			highThreshold: {
				iobType: 'number',
				write: true,
				min: 1,
				max: 99,
				step: 1,
				unit: '%'
			}
		},
		ledSettings: {
			isEnabled: {
				iobType: 'boolean',
				write: true,
				name: 'Status Light',
			}
		}
	}
};