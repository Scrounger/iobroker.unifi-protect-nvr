'use strict';

/*
 * Created with @iobroker/create-adapter v2.6.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

class UnifiProtectApi extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'unifi-protect-api',
		});

		this.ufp = undefined;
		this.devices = {
			cameras: {}
		};

		this.aliveInterval = 30;
		this.aliveTimeout = null;
		this.aliveTimestamp = new Date().getTime();

		this.connectionMaxRetries = 100;
		this.connectionRetries = 0;

		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		const logPrefix = '[onReady]:';

		try {
			this.log.debug(`${logPrefix} Loading unifi-protect ESM Module dynamically`);

			const UnifiProtectImport = (await import('unifi-protect')).ProtectApi;
			this.ufp = new UnifiProtectImport(this.log);

			await this.initListener();
			await this.establishConnection();


			// // Initialize your adapter here

			// // The adapters config (in the instance object everything under the attribute "native") is accessible via
			// // this.config:
			// this.log.info('config option1: ' + this.config.option1);
			// this.log.info('config option2: ' + this.config.option2);

			// /*
			// For every state in the system there has to be also an object of type state
			// Here a simple template for a boolean variable named "testVariable"
			// Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
			// */
			// await this.setObjectNotExistsAsync('testVariable', {
			// 	type: 'state',
			// 	common: {
			// 		name: 'testVariable',
			// 		type: 'boolean',
			// 		role: 'indicator',
			// 		read: true,
			// 		write: true,
			// 	},
			// 	native: {},
			// });

			// // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
			// this.subscribeStates('testVariable');
			// // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
			// // this.subscribeStates('lights.*');
			// // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
			// // this.subscribeStates('*');

			// /*
			// 	setState examples
			// 	you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
			// */
			// // the variable testVariable is set to true as command (ack=false)
			// await this.setStateAsync('testVariable', true);

			// // same thing, but the value is flagged "ack"
			// // ack should be always set to true if the value is received from or acknowledged from the target system
			// await this.setStateAsync('testVariable', { val: true, ack: true });

			// // same thing, but the state is deleted after 30s (getState will return null afterwards)
			// await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });

			// // examples for the checkPassword/checkGroup functions
			// let result = await this.checkPasswordAsync('admin', 'iobroker');
			// this.log.info('check user admin pw iobroker: ' + result);

			// result = await this.checkGroupAsync('admin', 'admin');
			// this.log.info('check group user admin group admin: ' + result);

		} catch (error) {
			this.log.error(`${logPrefix} ${error}`);
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		const logPrefix = '[onUnload]:';
		try {
			// Here you must clear all timeouts or intervals that may still be active
			if (this.aliveTimeout) clearTimeout(this.aliveTimeout);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			if (this.ufp) {
				this.ufp.reset();
				this.setStateAsync('info.connection', false, true);
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

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === 'object' && obj.message) {
	// 		if (obj.command === 'send') {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info('send command');

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
	// 		}
	// 	}
	// }

	async establishConnection() {
		const logPrefix = '[establishConnection]:';

		try {
			if (await this.login()) {
				await this.getDevices();
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
			this.log.error(`${logPrefix} ${error}`);
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
						await this.setStateAsync('info.connection', true, true);

						return true;
					} else {
						this.log.error(`${logPrefix} Unable to bootstrap the Unifi-Protect controller API`);
					}
				} else {
					this.log.error(`${logPrefix} Login to the Unifi-Protect controller API failed! (host: ${this.config.host})`);
				}
			}
		} catch (error) {
			this.log.error(`${logPrefix} ${error}`);
		}

		await this.setStateAsync('info.connection', false, true);
		return false;
	}

	async getDevices() {
		const logPrefix = '[getDevices]:';

		try {
			if (this.ufp && this.ufp.bootstrap) {
				// Add Cameras to List
				if (this.ufp.bootstrap.cameras) {
					for (const cam of this.ufp.bootstrap.cameras) {
						this.log.info(`${logPrefix}: Discovered ${cam.modelKey}: ${this.ufp.getDeviceName(cam, cam.name)} (IP: ${cam.host}, mac: ${cam.mac}, id: ${cam.id}, state: ${cam.state})`);
						this.devices.cameras[cam.id] = cam;
					}

					this.log.silly(`${logPrefix} devices.cameras: ${JSON.stringify(this.devices.cameras)}`);
				}
			}

		} catch (error) {
			this.log.error(`${logPrefix} ${error}`);
		}
	}

	async initListener() {
		const logPrefix = '[initListener]:';

		try {
			if (this.ufp) {
				this.ufp.on('message', async (event) => {
					// await tmp.decode('warn', data);

					// this.log.warn(event.header.modelKey);

					// this.log.warn(JSON.stringify(event.header));

					if (event.header.modelKey === 'camera') {
						// that.log.warn(JSON.stringify(event));

						if (this.devices.cameras[event.header.id]) {
							// this.log.warn(this.ufp.getDeviceName(this.devices.cameras[event.header.id]));
						}
					} else if (event.header.modelKey === 'nvr' && event.header.action === 'update' && event.payload.lastSeen) {
						// is used to check whether the connection to the controller exists
						this.aliveTimestamp = new Date().getTime();
					}
				});
				this.ufp.on('', async (event) => {
					this.log.error(JSON.stringify(event));
				});

			}
		} catch (error) {
			this.log.error(`${logPrefix} ${error}`);
		}
	}

	/**
	 * Check whether the connection to the controller exists, if not establish a new connection
	 */
	async aliveChecker() {
		const logPrefix = '[aliveChecker]:';

		try {
			if (this.ufp) {
				const diff = Math.round((new Date().getTime() - this.aliveTimestamp) / 1000);

				if (diff >= this.aliveInterval) {
					this.log.warn(`${logPrefix} No connection to the Unifi-Protect controller -> restart connection (retries: ${this.connectionRetries})`);
					this.ufp.reset();

					await this.setStateAsync('info.connection', false, true);

					if (this.connectionRetries < this.connectionMaxRetries) {
						this.connectionRetries++;

						this.establishConnection();
					} else {
						this.log.error(`${logPrefix} Connection to the Unifi-Protect controller is down for more then ${this.connectionMaxRetries * this.aliveInterval}s, stopping the adapter.`);
						this.stop();
					}
				} else {
					this.log.debug(`${logPrefix} Connection to the Unifi-Protect controller is alive (last alive signal is ${diff}s old)`);

					await this.setStateAsync('info.connection', true, true);
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
			this.log.error(`${logPrefix} ${error}`);
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new UnifiProtectApi(options);
} else {
	// otherwise start the instance directly
	new UnifiProtectApi();
}