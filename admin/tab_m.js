start()

let socket;

async function start() {
    socket = await this.connect();
    // socket.on('stateChange', onStateChange);

    // // const test = await getStateAsync('unifi-protect-nvr.0.cameras.D021F995D904.id');

    console.warn(this);
    // console.warn(this.io);


    // // alert(JSON.stringify(test));

    // socket.on('ready', (p) => {
    //     console.warn(JSON.stringify(p));
    // })
    // setTimeout(() => {
    //     console.warn(socket.connected);
    // }, 5000);

    // console.warn(socket.connected);

    // socket.emit('subscribeStates', '0_userdata.0.Lamelle');

    servConn.init({
        name: 'unifi-protect-nvr.0',  // optional - default 'vis.0'
        connLink: window.location.href.substr(0, window.location.href.indexOf('/', 8)),
    }, {
        onConnChange: function (isConnected) {
            if (isConnected) {
                waitForElement('body', '.myTabContainer', async () => {
                    // socket = servConn._socket
                    onReady();
                });
            }
        },
        onError: function (err) {
            window.alert(_('Cannot execute %s for %s, because of insufficient permissions', err.command, err.arg), _('Insufficient permissions'), 'alert', 600);
        }
    });
}

async function onReady() {
    const logPrefix = '[onReady]:';
    try {

        let recordedChunks = [];
        let ws = null;

        $("#play").on('click', async () => {
            console.warn('play');

            const ms = new MediaSource();
            const player = document.getElementById("video");

            player.src = URL.createObjectURL(ms);

            player.addEventListener("error", () => {
                console.log("player error");
            });

            await setStateAsync('unifi-protect-nvr.0.cameras.D021F995D904.channels.2.streamStart', true);
            const url = await getStateAsync('unifi-protect-nvr.0.cameras.D021F995D904.channels.2.streamUrl');

            console.warn(url);

            ms.addEventListener("sourceopen", () => {
                const sb = ms.addSourceBuffer(
                    'video/mp4; codecs="hev1.1.6.L150"'
                );
                ws = new WebSocket('wss://10.0.1.1/proxy/protect/ws/livestream?allowPartialGOP&camera=66746dee030b0803e4000518&channel=1&chunkSize=1024&extendedVideoMetadata&fragmentDurationMillis=100&progressive&rebaseTimestampsToZero=false&requestId=yn0uluwqi&sessionId=36ef3339-d3ea-489a-8cb9-41b8fbe7e350&type=fmp4');

                sb.mode = "sequence";

                sb.addEventListener("updateend", () => {
                    console.log(
                        sb.buffered,
                        sb.buffered.start(0),
                        '==>',
                        sb.buffered.end(0),
                        sb.mode,
                    )
                });
                sb.addEventListener("error", () => {
                    console.log("error");
                });

                ws.addEventListener("open", () => {
                    console.log("open");
                    // clear data
                    recordedChunks = [];
                });

                ws.addEventListener("message", (event) => {
                    event.data.arrayBuffer().then((buffer) => {
                        sb.appendBuffer(buffer);
                    });
                });
            });
            ms.addEventListener("error", () => {
                console.log("error");
            });
        });

        $("#stop").on('click', async () => {
            ws.close();
            await setStateAsync('unifi-protect-nvr.0.cameras.D021F995D904.channels.2.streamStart', false);
        });

        function download() {
            const blob = new Blob(recordedChunks, {
                type: "video/mp4",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "test.mp4";
            a.click();
            window.URL.revokeObjectURL(url);
        }

        // async function PeerConnection(media, eleId) {
        //     const pc = new RTCPeerConnection({
        //         iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        //     });

        //     const localTracks = [];

        //     if (/camera|microphone/.test(media)) {
        //         const tracks = await getMediaTracks('user', {
        //             video: media.indexOf('camera') >= 0,
        //             audio: media.indexOf('microphone') >= 0,
        //         });
        //         tracks.forEach(track => {
        //             pc.addTransceiver(track, { direction: 'sendonly' });
        //             if (track.kind === 'video') localTracks.push(track);
        //         });
        //     }

        //     if (media.indexOf('display') >= 0) {
        //         const tracks = await getMediaTracks('display', {
        //             video: true,
        //             audio: media.indexOf('speaker') >= 0,
        //         });
        //         tracks.forEach(track => {
        //             pc.addTransceiver(track, { direction: 'sendonly' });
        //             if (track.kind === 'video') localTracks.push(track);
        //         });
        //     }

        //     if (/video|audio/.test(media)) {
        //         const tracks = ['video', 'audio']
        //             .filter(kind => media.indexOf(kind) >= 0)
        //             .map(kind => pc.addTransceiver(kind, { direction: 'recvonly' }).receiver.track);
        //         localTracks.push(...tracks);
        //     }

        //     document.getElementById(eleId).srcObject = new MediaStream(localTracks);

        //     return pc;
        // }

        // async function getMediaTracks(media, constraints) {
        //     try {
        //         const stream = media === 'user'
        //             ? await navigator.mediaDevices.getUserMedia(constraints)
        //             : await navigator.mediaDevices.getDisplayMedia(constraints);
        //         return stream.getTracks();
        //     } catch (e) {
        //         console.warn(e);
        //         return [];
        //     }
        // }

        // async function connect(media, myUrl, myPara, eleId) {
        //     const pc = await PeerConnection(media, eleId);
        //     const url = new URL('api/ws' + myPara, myUrl);

        //     const test = await getStateAsync('unifi-protect-nvr.0.cameras.D021F995D904.channels.2.streamUrl');

        //     console.warn(test);

        //     const ws = new WebSocket('wss://10.0.1.1/proxy/protect/ws/livestream?allowPartialGOP&camera=66746dee02a50803e4000515&channel=1&chunkSize=1024&extendedVideoMetadata&fragmentDurationMillis=100&progressive&rebaseTimestampsToZero=false&requestId=z54qwhipm&sessionId=76a2cc2c-3ce5-4410-9f03-848f7c92d016&type=fmp4');

        //     ws.addEventListener('open', () => {
        //         pc.addEventListener('icecandidate', ev => {
        //             if (!ev.candidate) return;
        //             const msg = { type: 'webrtc/candidate', value: ev.candidate.candidate };
        //             ws.send(JSON.stringify(msg));
        //         });

        //         pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
        //             const msg = { type: 'webrtc/offer', value: pc.localDescription.sdp };
        //             ws.send(JSON.stringify(msg));
        //         });
        //     });

        //     ws.addEventListener('message', ev => {
        //         const msg = JSON.parse(ev.data);
        //         if (msg.type === 'webrtc/candidate') {
        //             pc.addIceCandidate({ candidate: msg.value, sdpMid: '0' });
        //         } else if (msg.type === 'webrtc/answer') {
        //             pc.setRemoteDescription({ type: 'answer', sdp: msg.value });
        //         }
        //     });
        // }



        // const collection = document.getElementsByClassName("myWebRtcPlayer");
        // console.warn(collection);

        // let fullscreen = false;

        // for (let i = 0; i < collection.length; i++) {
        //     let url = collection[i].getAttribute("myUrl");
        //     let parameter = "?" + url.split("?").pop();

        //     let id = 'myWebRtc_' + i;
        //     collection[i].setAttribute("id", id)

        //     const media = new URLSearchParams(url).get('media');
        //     connect(media || 'video+audio', url, parameter, id);

        //     // Verhindern das man pause machen kann
        //     collection[i].onpause = () => { collection[i].play() }

        //     // onClick -> Fullscreen
        //     collection[i].addEventListener('click', function (e) {
        //         if (fullscreen) {
        //             e.target.webkitExitFullscreen();
        //         } else {
        //             e.target.webkitEnterFullscreen();
        //         }
        //     });
        // }

        // document.addEventListener('webkitfullscreenchange', fullscreenCheck, false);
        // document.addEventListener('mozfullscreenchange', fullscreenCheck, false);
        // document.addEventListener('fullscreenchange', fullscreenCheck, false);
        // function fullscreenCheck(e) {
        //     if (document.fullscreenElement) {
        //         // console.log('fullscreen mode activated');
        //         fullscreen = true
        //     } else {
        //         // console.log('fullscreen mode deactivated');
        //         fullscreen = false
        //     }
        // }

    } catch (error) {
        console.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
    }
}

/** Is called if a subscribed state changes
 * @param {string} id
 * @param {ioBroker.State | null | undefined} state
 */
async function onStateChange(id, state) {
    const logPrefix = '[onStateChange]:';
    try {

        console.warn(`id: ${id}, state: ${JSON.stringify(state)}`);

    } catch (error) {
        console.error(`${logPrefix} error: ${error}, stack: ${error.stack}`);
    }
}

async function getStateAsync(id) {
    return new Promise((resolve, reject) => {
        socket.emit('getState', id, function (err, res) {
            if (!err && res) {
                resolve(res);
            } else {
                console.error(err);
                resolve(null);
            }
        });
    });
}

async function setStateAsync(id, val) {
    return new Promise((resolve, reject) => {
        socket.emit('setState', id, val, function (err, res) {
            if (!err && res) {
                resolve(res);
            } else {
                console.error(err);
                resolve(null);
            }
        });
    });
}

function waitForElement(parent, elementPath, callBack, counter = 0) {
    if (counter < 500) {
        setTimeout(function () {
            let element = $(parent).find(elementPath);
            if (element.length > 0) {
                console.debug(`[[waitForElement] it took ${counter}ms to wait for the element '${elementPath}'`);
                callBack(element);
            } else {
                counter++
                waitForElement(parent, elementPath, callBack, counter);
            }
        }, 1);
    } else {
        console.warn(`[waitForElement] stop waiting after ${counter} retries`);
        callBack();
    }
}

