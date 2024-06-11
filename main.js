'use strict';

/*
 * Created with @iobroker/create-adapter v2.6.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const moment = require('moment');

const myDeviceTypes = require('./lib/devices');
const myDeviceImages = require('./lib/deviceImages');
const myHelper = require('./lib/helper');


const fs = require('fs');

// Load your modules here, e.g.:
// const fs = require("fs");

class UnifiProtectNvr extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'unifi-protect-nvr',
			useFormatDate: true
		});

		this.isConnected = false;
		this.ufp = undefined;
		this.ufpLog = {
			debug: (message, ...parameters) => this.log.debug(`[ufp API]: ${message}${parameters && parameters.length > 0 ? ` - ${JSON.stringify(parameters)}` : ''}`),
			error: (message, ...parameters) => this.log.error(`[ufp API]: ${message}${parameters && parameters.length > 0 ? ` - ${JSON.stringify(parameters)}` : ''}`),
			info: (message, ...parameters) => this.log.info(`[ufp API]: ${message}${parameters && parameters.length > 0 ? ` - ${JSON.stringify(parameters)}` : ''}`),
			warn: (message, ...parameters) => this.log.debug(`[ufp API]: ${message}${parameters && parameters.length > 0 ? ` - ${JSON.stringify(parameters)}` : ''}`)
		};

		this.devices = {
			nvr: {},
			cameras: {}
		};

		this.eventStore = {
			cameras: {}
		};

		this.aliveInterval = 15;
		this.aliveTimeout = null;
		this.aliveTimestamp = moment().valueOf();

		this.retentionTimeout = null;

		this.connectionMaxRetries = 200;
		this.connectionRetries = 0;

		this.paths = {
			eventThumb: '/proxy/protect/api/events/{0}/thumbnail',
			eventAnimatedThumb: '/proxy/protect/api/events/{0}/animated-thumbnail'
		};

		this.defaultImage = {
			snapshot: '',
			thumbnail: '',
			thumbnailAnimated: ''
		};

		this.storagePaths = {
			snapshotCameras: '/snapshot/cameras/'
		};

		this.fileNameFormat = 'YYYY_MM_DD_HH_mm_ss';

		this.configFilterList = [];		// List for AutoComplete in adapter settings
		this.configFilterListIgnore = ['cameras'];
		this.blacklistedStates = [];	// prepared List for filtering out states

		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/** Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		const logPrefix = '[onReady]:';

		try {
			moment.locale(this.language);

			this.setDefaultImages();

			await this.prepareBlacklistedStates();

			if (this.config.host, this.config.user, this.config.password) {
				this.log.debug(`${logPrefix} Loading unifi-protect ESM Module dynamically`);

				const UnifiProtectImport = (await import('unifi-protect')).ProtectApi;
				this.ufp = new UnifiProtectImport(this.ufpLog);

				// listen to realtime events (must be given as function to be able to use this)
				this.ufp.on('message', (event) => this.onProtectEvent(event));

				await this.establishConnection(true);

			} else {
				this.log.warn(`${logPrefix} no login credentials in adapter config set!`);
			}

			this.retentionManager();

		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		const logPrefix = '[onUnload]:';
		try {
			// Here you must clear all timeouts or intervals that may still be active
			if (this.aliveTimeout) clearTimeout(this.aliveTimeout);
			if (this.retentionTimeout) clearTimeout(this.retentionTimeout);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			if (this.ufp) {
				this.ufp.reset();
				this.setConnectionStatus(false);
				this.log.info(`${logPrefix} Logged out successfully from the Unifi-Protect controller API. (host: ${this.config.host})`);
			}

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/** Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	async onStateChange(id, state) {
		const logPrefix = '[onStateChange]:';
		try {
			if (this.isConnected && this.ufp) {

				if (state && !state.from.includes(this.namespace)) {
					// The state was changed
					if (id.includes('cameras')) {
						const camId = id.split('.')[3];

						if (id.includes(myDeviceTypes.cameras.takeSnapshot.id)) {
							this.getSnapshot(this.devices.cameras[camId], `cameras.${camId}.${myDeviceTypes.cameras.takeSnapshotUrl.id}`, this.config.manualSnapshotWidth, this.config.manualSnapshotHeight);
						} else {
							// write settings
							if (this.devices.cameras[camId]) {
								const writeValFunction = myHelper.getObjectByString(`${id.split(`${camId}.`).pop()}.writeVal`, myDeviceTypes.cameras, '.');

								let objWrite = null;

								if (writeValFunction) {
									objWrite = myHelper.strToObj(id.split(`${camId}.`).pop(), writeValFunction(state.val));
								} else {
									objWrite = myHelper.strToObj(id.split(`${camId}.`).pop(), state.val);
								}

								const response = await this.ufp.updateDevice(this.devices.cameras[camId], objWrite);

								if (response !== null) {
									this.log.debug(`${logPrefix} ${this.ufp.getDeviceName(this.devices.cameras[camId])} - state '${id}' changed, objWrite: ${JSON.stringify(objWrite)}`);
									this.log.info(`${logPrefix} ${this.ufp.getDeviceName(this.devices.cameras[camId])} - state '${id}' changed to '${state.val}'`);
								} else {
									this.log.warn(`${logPrefix} ${this.ufp.getDeviceName(this.devices.cameras[camId])} - changing state '${id}' to '${state.val}' not successful!`);
								}
							} else {
								this.log.error(`${logPrefix} cam (id ${camId}) not exists in devices list`);
							}
						}
					} else {
						this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
					}
				} else {
					// The state was deleted
					// this.log.info(`state ${id} deleted`);
				}
			} else {
				this.log.warn(`${logPrefix} No Connection to the Unifi-Controller, '${id}' cannot be written!`);
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}



	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	async onMessage(obj) {
		// this.log.warn(JSON.stringify(obj.command));
		if (typeof obj === 'object' && obj.message) {
			if (obj.command === 'filterList') {
				if (this.configFilterList.length === 0) {
					await this.createConfigFilterList(myDeviceTypes);
				}

				// Send response in callback if required
				if (obj.callback) this.sendTo(obj.from, obj.command, this.configFilterList, obj.callback);
			}
		}
	}

	async establishConnection(isAdapterStart = false) {
		const logPrefix = '[establishConnection]:';

		try {
			if (await this.login()) {
				await this.getDevices(isAdapterStart);
			}

			// start the alive checker
			if (this.aliveTimeout) {
				this.clearTimeout(this.aliveTimeout);
				this.aliveTimeout = null;
			}

			this.aliveTimeout = this.setTimeout(() => {
				this.aliveChecker();
			}, this.aliveInterval * 1000);

		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	async login() {
		const logPrefix = '[login]:';

		try {
			if (this.ufp) {
				const loginSuccessful = await this.ufp.login(this.config.host, this.config.user, this.config.password);

				if (loginSuccessful) {
					this.log.info(`${logPrefix} Logged in successfully to the Unifi-Protect controller API. (host: ${this.config.host})`);

					if (await this.ufp.getBootstrap()) {
						this.log.debug(`${logPrefix} successfully received bootstrap`);
						await this.setConnectionStatus(true);

						return true;
					} else {
						this.log.error(`${logPrefix} Unable to bootstrap the Unifi-Protect controller API`);
					}
				} else {
					this.log.error(`${logPrefix} Login to the Unifi-Protect controller API failed! (host: ${this.config.host})`);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}

		await this.setConnectionStatus(false);

		return false;
	}

	async getDevices(isAdapterStart) {
		const logPrefix = '[getDevices]:';

		try {
			if (this.ufp && this.ufp.bootstrap) {
				this.log.silly(`bootstrap: ${JSON.stringify(this.ufp.bootstrap)}`);

				if (this.ufp.bootstrap.nvr) {
					this.log.info(`${logPrefix}: Discovered ${this.ufp.bootstrap.nvr.modelKey}: ${this.ufp.getDeviceName(this.ufp.bootstrap.nvr, this.ufp.bootstrap.nvr.name)} (IP: ${this.ufp.bootstrap.nvr.host}, mac: ${this.ufp.bootstrap.nvr.mac}, id: ${this.ufp.bootstrap.nvr.id})`);
					this.devices.nvr = this.ufp.bootstrap.nvr;

					if (isAdapterStart) {
						await this.createNvrStates(this.ufp.bootstrap.nvr);
					}
				}

				// Add Cameras to List
				if (this.ufp.bootstrap.cameras) {
					for (const cam of this.ufp.bootstrap.cameras) {
						this.log.info(`${logPrefix}: Discovered ${cam.modelKey}: ${this.ufp.getDeviceName(cam, cam.name)} (IP: ${cam.host}, mac: ${cam.mac}, id: ${cam.id}, state: ${cam.state})`);
						this.devices.cameras[cam.id] = cam;

						if (isAdapterStart) {
							await this.createCameraStates(cam);
						}
					}
					this.log.silly(`${logPrefix} devices.cameras: ${JSON.stringify(this.devices.cameras)}`);
				}
			}

		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/**
	 @param {import("unifi-protect", { with: { "resolution-mode": "import" } }).ProtectEventPacket} event
	 */
	async onProtectEvent(event) {
		const logPrefix = '[onProtectEvent]:';

		try {
			this.aliveTimestamp = moment().valueOf();

			if (event.header.modelKey === 'camera') {
				const camId = event.header.id;

				await this.updateStates(camId, 'cameras', this.devices.cameras[camId], myDeviceTypes.cameras, event.payload);
			} else if (event.header.modelKey === 'event') {
				if (this.config.motionEventsEnabled && event.header.recordModel === 'camera') {
					const cam = this.devices.cameras[event.header.recordId];
					this.onCamMotionEvent(cam, event.header, event.payload);
				}
			} else if (event.header.modelKey === 'nvr') {
				await this.updateStates('nvr', undefined, this.devices.nvr, myDeviceTypes.nvr, event.payload);
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/**
	 * @param {import("unifi-protect", { with: { "resolution-mode": "import" } }).ProtectCameraConfigInterface} cam
	 * @param {{ action?: string; id: any; modelKey?: string; newUpdateId?: string; mac?: string | undefined; nvrMac?: string | undefined; recordModel?: string | undefined; recordId?: string | undefined; }} header
	 * @param {object} payload
	 */
	async onCamMotionEvent(cam, header, payload) {
		const logPrefix = '[onMotionEvent]:';

		try {
			// motion events consist multiple events
			if (this.ufp) {
				// ToDo: log level silly
				this.log.debug(`${this.ufp.getDeviceName(cam)} - eventId: ${header.id}, payload: ${JSON.stringify(payload)}`);

				if (payload.type === 'motion' || payload.type === 'smartDetectZone' || payload.type === 'smartDetectLine' || this.eventStore.cameras[header.id]) {
					const camId = `cameras.${cam.id}`;

					if (Object.prototype.hasOwnProperty.call(payload, 'start')) {
						// Motion event start -> start property is available

						this.log.debug(`${logPrefix} ${this.ufp.getDeviceName(cam)} - motion event start (type: ${payload.type})`);

						this.eventStore.cameras[header.id] = {
							// properties must be equal to the defined properties in {@link myDeviceTypes} -> used in function 'setCustomMotionEventStates'
							lastMotionEventId: header.id,
							snapshotTaken: false,
							lastMotionType: payload.type,
							lastMotionScore: payload.score ? payload.score : 0,
							lastMotionSmartTypes: payload.smartDetectTypes && payload.smartDetectTypes.length > 0 ? payload.smartDetectTypes : ['none'],
							lastMotionStart: payload.start,
							lastMotionEnd: null
						};

						// set custom states - using eventStore because conversions may be defined here
						this.setCustomMotionEventStates('cameras', cam, this.eventStore.cameras[header.id]);

						// reset snapshot at beginning of motion event
						this.setStateExists(`${camId}.${myDeviceTypes.cameras.lastMotionSnapshot.id}`, this.defaultImage.snapshot, true);

						// reset thumbnail at beginning of motion event
						this.setStateExists(`${camId}.${myDeviceTypes.cameras.lastMotionThumbnail.id}`, this.defaultImage.thumbnail, true);

						// reset thumbnail animated at beginning of motion event
						this.setStateExists(`${camId}.${myDeviceTypes.cameras.lastMotionThumbnailAnimated.id}`, this.defaultImage.thumbnailAnimated, true);

						// Snapshot Delay configured
						if (this.config.motionSnapshot && this.config.motionSnapshotDelay >= 0 && !this.eventStore.cameras[header.id].snapshotTaken) {
							setTimeout(() => {
								this.getSnapshot(cam, `${camId}.${myDeviceTypes.cameras.lastMotionSnapshot.id}`, this.config.motionSnapshotWidth, this.config.motionSnapshotHeight, header.id, true);
								this.eventStore.cameras[header.id].snapshotTaken = true;
							}, this.config.motionSnapshotDelay * 1000);
						}
					} else {
						// following events, have the same eventId
						if (this.eventStore.cameras[header.id]) {
							this.eventStore.cameras[header.id].lastMotionScore = payload.score ? payload.score : this.eventStore.cameras[header.id].lastMotionScore;
							this.eventStore.cameras[header.id].lastMotionEnd = payload.end ? payload.end : this.eventStore.cameras[header.id].lastMotionEnd;
							this.eventStore.cameras[header.id].lastMotionSmartTypes = payload.smartDetectTypes ? payload.smartDetectTypes : this.eventStore.cameras[header.id].lastMotionSmartTypes;

							// Snapshot configured -1 = auto
							if (this.config.motionSnapshot && this.config.motionSnapshotDelay === -1 && !this.eventStore.cameras[header.id].snapshotTaken) {
								this.getSnapshot(cam, `${camId}.${myDeviceTypes.cameras.lastMotionSnapshot.id}`, this.config.motionSnapshotWidth, this.config.motionSnapshotHeight, header.id, true);
								this.eventStore.cameras[header.id].snapshotTaken = true;
							}

							// Motion event finished -> paylod have 'metadata.detectedThumbnails'
							if (Object.prototype.hasOwnProperty.call(payload, 'metadata') && Object.prototype.hasOwnProperty.call(payload['metadata'], 'detectedThumbnails')) {
								this.log.debug(`${logPrefix} ${this.ufp.getDeviceName(cam)} - motion event finished (eventStore: ${JSON.stringify(this.eventStore.cameras[header.id])})`);

								// set custom states - using eventStore because conversions may be defined here
								this.setCustomMotionEventStates('cameras', cam, this.eventStore.cameras[header.id], true);

								if (this.config.motionThumb)
									this.getEventThumb(cam, `${camId}.${myDeviceTypes.cameras.lastMotionThumbnail.id}`, header.id, this.config.motionThumbWidth, this.config.motionThumbHeight);

								if (this.config.motionThumbAnimated)
									this.getEventAnimatedThumb(cam, `${camId}.${myDeviceTypes.cameras.lastMotionThumbnailAnimated.id}`, header.id, this.config.motionThumbAnimatedWidth, this.config.motionThumbAnimatedHeight, this.config.motionThumbAnimatedSpeedUp);

								delete this.eventStore.cameras[header.id];
							}
						}
					}
				} else if (Object.prototype.hasOwnProperty.call(payload, 'type')) {
					this.log.warn(`${logPrefix} event from type '${payload.type}' is not implemented! Please report this to the developer (header: ${JSON.stringify(header)}, payload: ${JSON.stringify(payload)})`);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	async getEventThumb(cam, targetId, eventId, width, height) {
		if (this.ufp && this.isConnected) {
			const logPrefix = `[getEventThumb]: ${this.ufp.getDeviceName(cam)} - `;

			try {
				const url = `https://${this.config.host}${this.paths.eventThumb.replace('{0}', eventId)}?w=${width}&h=${height}`;
				const response = await this.ufp.retrieve(url, undefined, true);

				// response is from type Fetch (https://github.com/hjdhjd/unifi-protect/blob/main/docs/ProtectApi.md#retrieve)
				if (response) {
					if (response.ok) {
						const imageBuffer = Buffer.from(await response.arrayBuffer());
						const imageBase64 = imageBuffer.toString('base64');
						const base64ImgString = `data:image/jpeg;base64,` + imageBase64;

						this.log.debug(`${logPrefix} thumb successfully received (eventId: ${eventId})`);

						await this.setStateExists(targetId, base64ImgString);
					} else {
						this.log.error(`${logPrefix} response code: ${response.status}`);
					}
				} else {
					this.log.warn(`${logPrefix} no response from the server, no thumb found!`);
				}

			} catch (error) {
				this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
			}
		}
	}

	async getEventAnimatedThumb(cam, targetId, eventId, width, height, speedup) {
		if (this.ufp && this.isConnected) {
			const logPrefix = `[getEventAnimatedThumb]: ${this.ufp.getDeviceName(cam)} - `;

			try {
				const url = `https://${this.config.host}${this.paths.eventAnimatedThumb.replace('{0}', eventId)}?w=${width}&h=${height}&keyFrameOnly=true&speedup=${speedup}`;
				const response = await this.ufp.retrieve(url, undefined, true);

				// response is from type Fetch (https://github.com/hjdhjd/unifi-protect/blob/main/docs/ProtectApi.md#retrieve)
				if (response) {
					if (response.ok) {
						const imageBuffer = Buffer.from(await response.arrayBuffer());
						const imageBase64 = imageBuffer.toString('base64');
						const base64ImgString = `data:image/gif;base64,` + imageBase64;

						this.log.debug(`${logPrefix} animated thumb successfully received (eventId: ${eventId})`);

						await this.setStateExists(targetId, base64ImgString);
					} else {
						this.log.error(`${logPrefix} response code: ${response.status}`);
					}
				} else {
					this.log.warn(`${logPrefix} no response from the server, no thumb found!`);
				}

			} catch (error) {
				this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
			}
		}
	}

	/** take a snap shot using the ufp lib
	 * @param {import("unifi-protect", { with: { "resolution-mode": "import" } }).ProtectCameraConfigInterface} cam
	 * @param {string} targetId state where the base64 image or url should be stored
	 * @param {number} width
	 * @param {number} height
	 * @param {any} eventId
	 */
	async getSnapshot(cam, targetId, width, height, eventId = undefined, base64Image = false) {
		if (this.ufp && this.isConnected) {
			const logPrefix = `[getSnapshot]: ${this.ufp.getDeviceName(cam)} - `;

			try {
				const now = moment();
				const imageBuffer = await this.ufp.getSnapshot(cam, width, height, now.valueOf());

				if (imageBuffer) {
					if (base64Image) {
						const imageBase64 = imageBuffer.toString('base64');
						const base64ImgString = `data:image/jpeg;base64,` + imageBase64;

						this.log.debug(`${logPrefix} snapshot successfully received (eventId: ${eventId})`);

						await this.setStateExists(targetId, base64ImgString);
					} else {
						const filename = `${this.storagePaths.snapshotCameras}${cam.displayName.replaceAll(' ', '_')}_${cam.id}/${now.format(this.fileNameFormat)}.png`;

						await this.writeFileAsync(this.namespace, filename, imageBuffer);

						this.log.info(`${logPrefix} snapshot successfully received (/${this.namespace}${filename})`);

						await this.setStateExists(targetId, `/${this.namespace}${filename}`);
					}
				}
			} catch (error) {
				this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
			}
		}
	}

	/** Check whether the connection to the controller exists, if not try to establish a new connection
	 */
	async aliveChecker() {
		const logPrefix = '[aliveChecker]:';

		try {
			if (this.ufp) {
				const diff = Math.round((moment().valueOf() - this.aliveTimestamp) / 1000);

				if (diff >= this.aliveInterval) {
					this.log.warn(`${logPrefix} No connection to the Unifi-Protect controller -> restart connection (retries: ${this.connectionRetries})`);
					this.ufp.reset();

					await this.setConnectionStatus(false);

					if (this.connectionRetries < this.connectionMaxRetries) {
						this.connectionRetries++;

						await this.establishConnection();
					} else {
						this.log.error(`${logPrefix} Connection to the Unifi-Protect controller is down for more then ${this.connectionMaxRetries * this.aliveInterval}s, stopping the adapter.`);
						this.stop({ reason: 'too many connection retries' });
					}
				} else {
					this.log.silly(`${logPrefix} Connection to the Unifi-Protect controller is alive (last alive signal is ${diff}s old)`);

					await this.setConnectionStatus(true);
					this.connectionRetries = 0;

					if (this.aliveTimeout) {
						this.clearTimeout(this.aliveTimeout);
						this.aliveTimeout = null;
					}

					this.aliveTimeout = this.setTimeout(() => {
						this.aliveChecker();
					}, this.aliveInterval * 1000);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}


	/** Create nvr states
	 * @param {import("unifi-protect", { with: { "resolution-mode": "import" } }).ProtectNvrConfigInterface} nvr
	 */
	async createNvrStates(nvr) {
		const logPrefix = '[createNvrStates]:';

		try {
			if (this.ufp) {
				if (!await this.objectExists(`nvr`)) {
					this.log.debug(`${logPrefix} creating channel '${nvr.id}' for nvr '${this.ufp.getDeviceName(nvr, nvr.name)}'`);
					await this.setObjectAsync('nvr', {
						type: 'channel',
						common: {
							name: this.ufp.getDeviceName(nvr, nvr.name),
							icon: myDeviceImages[nvr.marketName] ? myDeviceImages[nvr.marketName] : null
						},
						native: {}
					});
				} else {
					const obj = await this.getObjectAsync(`nvr`);

					if (obj && obj.common && !obj.common.icon && myDeviceImages[nvr.marketName]) {
						this.extendObject(`nvr`, { common: { icon: myDeviceImages[nvr.marketName] } });
					}
				}

				await this.createGenericState('nvr', myDeviceTypes.nvr, nvr, 'nvr');
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** Create camera states
	 * @param {import("unifi-protect", { with: { "resolution-mode": "import" } }).ProtectCameraConfigInterface} cam
	 */
	async createCameraStates(cam) {
		const logPrefix = '[createCameraStates]:';

		try {
			if (this.ufp) {
				if (!await this.objectExists(`cameras.${cam.id}`)) {
					// create cam channel
					this.log.debug(`${logPrefix} creating channel '${cam.id}' for camera '${this.ufp.getDeviceName(cam, cam.name)}'`);
					await this.createChannelAsync('cameras', cam.id, {
						name: this.ufp.getDeviceName(cam, cam.name),
						icon: myDeviceImages[cam.marketName] ? myDeviceImages[cam.marketName] : null
					});
				} else {
					const obj = await this.getObjectAsync(`cameras.${cam.id}`);

					if (obj && obj.common && !obj.common.icon && myDeviceImages[cam.marketName]) {
						this.extendObject(`cameras.${cam.id}`, { common: { icon: myDeviceImages[cam.marketName] } });
					}
				}

				await this.createGenericState(`cameras.${cam.id}`, myDeviceTypes.cameras, cam, 'cameras');
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}



	/** Create all states for a devices, that are defined in {@link myDeviceTypes}
	 * @param {string} channel id of channel (e.g. camera id)
	 * @param {object} deviceTypes defined states and types in {@link myDeviceTypes}
	 * @param {object} objValues ufp bootstrap values of device
	 * @param {string} filterComparisonId id for filter
	 */
	async createGenericState(channel, deviceTypes, objValues, filterComparisonId) {
		const logPrefix = '[createGenericState]:';

		try {
			// {@link myDevices}
			for (const id in deviceTypes) {
				try {
					if (id && Object.prototype.hasOwnProperty.call(deviceTypes[id], 'type') && !Object.prototype.hasOwnProperty.call(deviceTypes[id], 'isArray')) {
						// if we have a 'type' property, then it's a state
						let stateId = id;

						if (Object.prototype.hasOwnProperty.call(deviceTypes[id], 'id')) {
							// if we have a custom state, use defined id
							stateId = deviceTypes[id].id;
						}
						if (!this.blacklistedStates.includes(`${filterComparisonId}.${id}`)) {
							// not on blacklist

							if (!await this.objectExists(`${channel}.${stateId}`)) {
								this.log.debug(`${logPrefix} creating state '${channel}.${stateId}'`);
								const obj = {
									type: 'state',
									common: {
										name: deviceTypes[id].name ? deviceTypes[id].name : id,
										type: deviceTypes[id].type,
										read: deviceTypes[id].read ? deviceTypes[id].read : true,
										write: deviceTypes[id].write ? deviceTypes[id].write : false,
										role: deviceTypes[id].role ? deviceTypes[id].role : 'state',
										unit: deviceTypes[id].unit ? deviceTypes[id].unit : ''
									},
									native: {}
								};

								if (deviceTypes[id].states) {
									obj.common.states = deviceTypes[id].states;
								}

								// @ts-ignore
								await this.setObjectAsync(`${channel}.${stateId}`, obj);
							}

							if (deviceTypes[id].write && deviceTypes[id].write === true) {
								// state is writeable -> subscribe it
								this.log.silly(`${logPrefix} subscribing state '${channel}.${id}'`);
								await this.subscribeStatesAsync(`${channel}.${stateId}`);
							}

							if (objValues && Object.prototype.hasOwnProperty.call(objValues, id)) {
								// write current val to state
								if (deviceTypes[id].convertVal) {
									await this.setStateChangedAsync(`${channel}.${stateId}`, deviceTypes[id].convertVal(objValues[id]), true);
								} else {
									await this.setStateChangedAsync(`${channel}.${stateId}`, objValues[id], true);
								}
							} else {
								if (!Object.prototype.hasOwnProperty.call(deviceTypes[id], 'id')) {
									// only report it if it's not a custom defined state
									this.log.warn(`${logPrefix} property '${channel}.${stateId}' not exists in bootstrap values`);
								}
							}
						} else {
							// is on blacklist
							if (await this.objectExists(`${channel}.${stateId}`)) {
								this.log.info(`${logPrefix} deleting blacklisted state '${channel}.${stateId}'`);
								await this.delObjectAsync(`${channel}.${stateId}`);
							}
						}
					} else {
						if (!this.blacklistedStates.includes(`${filterComparisonId}.${id}`)) {
							// it's a channel, create it and iterate again over the properties
							if (!await this.objectExists(`${channel}.${id}`)) {
								this.log.debug(`${logPrefix} creating channel '${channel}.${id}'`);

								await this.setObjectAsync(`${channel}.${id}`, {
									type: 'channel',
									common: {
										name: id
									},
									native: {}
								});

							}

							if (objValues[id].constructor.name === 'Array' && Object.prototype.hasOwnProperty.call(deviceTypes[id], 'isArray')) {
								for (let i = 0; i <= objValues[id].length - 1; i++) {
									await this.createGenericState(`${channel}.${id}.${i}`, deviceTypes[id].items, objValues[id][i], `${filterComparisonId}.${id}`);
								}
							} else {
								await this.createGenericState(`${channel}.${id}`, deviceTypes[id], objValues[id], `${filterComparisonId}.${id}`);
							}
						} else {
							if (await this.objectExists(`${channel}.${id}`)) {
								this.log.info(`${logPrefix} deleting blacklisted channel '${channel}.${id}'`);
								await this.delObjectAsync(`${channel}.${id}`, { recursive: true });
							}
						}
					}
				} catch (error) {
					this.log.error(`${logPrefix} [id: ${id}] error: ${error}, stack: ${error.stack}`);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}


	/** Update device values from event payload
	 * @param {any} idDevice id of device (e.g. camera id)
	 * @param {string | undefined} idParentDevice id of parent device (e.g. cameras)
	 * @param {object} deviceTypes defined states and types in {@link myDeviceTypes}
	 * @param {object} payload data from event
	 */
	async updateStates(idDevice, idParentDevice, device, deviceTypes, payload, idPrefix = '') {
		const logPrefix = '[updateStates]:';

		try {
			for (const key in payload) {
				if (deviceTypes[key]) {
					if (Object.prototype.hasOwnProperty.call(deviceTypes[key], 'type')) {
						const id = `${idParentDevice ? `${idParentDevice}.` : ''}${idDevice}${idPrefix}.${key}`;
						const val = deviceTypes[key].convertVal ? deviceTypes[key].convertVal(payload[key]) : payload[key];

						if (this.log.level === 'silly') {
							const oldState = await this.getStateAsync(id);

							if (oldState && oldState.val !== val) {
								this.log.silly(`${logPrefix} ${this.ufp?.getDeviceName(device)} - update state '${idPrefix}.${key}': ${val} (oldVal: ${oldState.val})`);
							}
						}

						if (await this.objectExists(id)) // check, as id may be on blacklist
							await this.setStateChangedAsync(id, val, true);
					} else {
						await this.updateStates(idDevice, idParentDevice, device, deviceTypes[key], payload[key], `${idPrefix}.${key}`);
					}
				}
			}

		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	async retentionManager() {
		const logPrefix = '[retentionManager]:';

		try {
			this.log.debug(`${logPrefix} retention check starting...`);
			if (this.config.manualSnapshotRetention > 0) {
				let dirList = null;

				try {
					dirList = await this.readDirAsync(this.namespace, this.storagePaths.snapshotCameras);
				} catch (ignore) {
					// no dir's found -> ignore
				}

				if (dirList !== null) {
					for (const dir of dirList) {
						if (dir.isDir) {
							let dirCams = null;

							try {
								dirCams = await this.readDirAsync(this.namespace, `${this.storagePaths.snapshotCameras}${dir.file}/`);
							} catch (ignore) {
								// no dir's found -> ignore
							}

							if (dirCams !== null) {
								for (const file of dirCams) {
									const diff = moment().diff(moment(file.file, this.fileNameFormat), 'days');

									if (diff >= this.config.manualSnapshotRetention) {
										const fileName = `${this.storagePaths.snapshotCameras}${dir.file}/${file.file}`;
										this.delFileAsync(this.namespace, fileName);
										this.log.info(`${logPrefix} snapshot '${fileName}' deleted, because it's ${diff} days old`);
									}
								}
							}
						}
					}
				}

				if (this.retentionTimeout) {
					this.clearTimeout(this.retentionTimeout);
					this.retentionTimeout = null;
				}

				this.retentionTimeout = this.setTimeout(() => {
					this.retentionManager();
				}, 60 * 60 * 1000);
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** create list of all states for adapter config (sendTo from frontend)
	 * @param {object} deviceTypes defined states and types in {@link myDeviceTypes}
	 * @param {string} idPrefix
	 */
	async createConfigFilterList(deviceTypes, idPrefix = '') {
		const logPrefix = '[createFilterList]:';

		try {
			for (const key in deviceTypes) {

				if (key && Object.prototype.hasOwnProperty.call(deviceTypes[key], 'type')) {
					// if we have a 'type' property, then it's a state
					let stateId = key;

					if (Object.prototype.hasOwnProperty.call(deviceTypes[key], 'id')) {
						// if we have a custom state, use defined id
						stateId = deviceTypes[key].id;
					}

					this.configFilterList.push({
						label: `[State]\t\t ${idPrefix}${stateId}`,
						value: `${idPrefix}${key}`,
					});
				} else {
					if (!this.configFilterListIgnore.includes(key)) {
						this.configFilterList.push({
							label: `[Channel]\t ${idPrefix}${key}`,
							value: `${idPrefix}${key}`,
						});
					}

					await this.createConfigFilterList(deviceTypes[key], `${idPrefix}${key}.`);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** transform adapter config blacklisted states into to an array
	 */
	async prepareBlacklistedStates() {
		const logPrefix = '[prepareBlacklistedStates]:';

		try {
			for (const key in this.config.blacklistedStates) {
				if (this.config.blacklistedStates[key]) {
					this.blacklistedStates.push(this.config.blacklistedStates[key].id);
				}
			}
			this.log.debug(`${logPrefix} blacklist states: ${JSON.stringify(this.blacklistedStates)}`);
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** Set adapter info.connection state and internal var
	 * @param {boolean} isConnected
	 */
	async setConnectionStatus(isConnected) {
		const logPrefix = '[setConnectionStatus]:';

		try {
			this.isConnected = isConnected;
			await this.setStateAsync('info.connection', isConnected, true);
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}


	/** settings values for all states that are available in eventStore
	 * @param {string} channelId
	 * @param {import("unifi-protect", { with: { "resolution-mode": "import" } }).ProtectKnownDeviceTypes} cam
	 * @param {object} eventStoreObj
	 */
	async setCustomMotionEventStates(channelId, cam, eventStoreObj, onlyChanges = false) {
		const logPrefix = '[setCustomMotionEventStates]:';

		try {
			for (const key in eventStoreObj) {
				if (Object.prototype.hasOwnProperty.call(myDeviceTypes.cameras, key)) {
					const id = `${channelId}.${cam.id}.${myDeviceTypes.cameras[key].id}`;
					const val = myDeviceTypes.cameras[key].convertVal ? myDeviceTypes.cameras[key].convertVal(eventStoreObj[key]) : eventStoreObj[key];

					await this.setStateExists(id, val, onlyChanges);
					this.log.silly(`${logPrefix} ${this.ufp?.getDeviceName(cam)}, eventId: ${eventStoreObj.eventId} - update state '${id}': ${val}`);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** check if state exists before setting value
	 * @param {string} id
	 * @param {any} val
	 */
	async setStateExists(id, val, onlyChanges = false) {
		const logPrefix = '[setThumbState]:';

		try {
			if (await this.objectExists(id)) {
				if (!onlyChanges) {
					await this.setStateAsync(id, val, true);
				} else {
					await this.setStateChangedAsync(id, val, true);
				}
			}

		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** set default images for snapshot, thumbnail and thumbnailAnimated - will be shown if no image is available / loading
	 */
	async setDefaultImages() {
		const logPrefix = '[setDefaultImages]:';

		try {
			this.defaultImage.snapshot = await this.loadDefaultImage('defaultSnapshot.png');
			this.defaultImage.thumbnail = await this.loadDefaultImage('defaultThumbnail.png');
			this.defaultImage.thumbnailAnimated = await this.loadDefaultImage('defaultThumbnailAnimated.png');
		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}
	}

	/** copy default images to instance folder (e.g. /unifi-protect-nvr.0/) if not exists and load them
	 * @param {string} fileName
	 * @returns base64 image string
	 */
	async loadDefaultImage(fileName) {
		const logPrefix = '[loadDefaultImage]:';

		try {
			if (!await this.fileExistsAsync(this.namespace, fileName)) {
				const logoFile = fs.readFileSync('./admin/unifi-protect-nvr.png');
				await this.writeFileAsync(this.namespace, fileName, logoFile);
			}

			const img = await this.readFileAsync(this.namespace, fileName);

			const imageBuffer = Buffer.from(img.file);
			const imageBase64 = imageBuffer.toString('base64');
			const base64ImgString = `data:image/png;base64,` + imageBase64;

			this.log.debug(`${logPrefix} default image '${fileName}' loaded`);

			return base64ImgString;

		} catch (error) {
			this.log.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
		}

		return '';
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new UnifiProtectNvr(options);
} else {
	// otherwise start the instance directly
	new UnifiProtectNvr();
}