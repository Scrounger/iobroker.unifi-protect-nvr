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

//     // if (media.indexOf('display') >= 0) {
//     //     const tracks = await getMediaTracks('display', {
//     //         video: true,
//     //         audio: media.indexOf('speaker') >= 0,
//     //     });
//     //     tracks.forEach(track => {
//     //         pc.addTransceiver(track, { direction: 'sendonly' });
//     //         if (track.kind === 'video') localTracks.push(track);
//     //     });
//     // }

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
//     const ws = new WebSocket('ws' + url.toString().substring(4));

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

const collection = document.getElementsByClassName("myWebRtcPlayer");
console.warn(collection);

let fullscreen = false;

for (let i = 0; i < collection.length; i++) {
    let url = collection[i].getAttribute("myUrl");
    console.warn('hier');
    console.warn(url);
    let parameter = "?" + url.split("?").pop();

    let id = 'myWebRtc_' + i;
    collection[i].setAttribute("id", id)

    const media = new URLSearchParams(url).get('media');
    connect(media || 'video+audio', url, parameter, id);

    // Verhindern das man pause machen kann
    collection[i].onpause = () => { collection[i].play() }

    // onClick -> Fullscreen
    collection[i].addEventListener('click', function (e) {
        if (fullscreen) {
            e.target.webkitExitFullscreen();
        } else {
            e.target.webkitEnterFullscreen();
        }
    });
}

document.addEventListener('webkitfullscreenchange', fullscreenCheck, false);
document.addEventListener('mozfullscreenchange', fullscreenCheck, false);
document.addEventListener('fullscreenchange', fullscreenCheck, false);
function fullscreenCheck(e) {
    if (document.fullscreenElement) {
        // console.log('fullscreen mode activated');
        fullscreen = true
    } else {
        // console.log('fullscreen mode deactivated');
        fullscreen = false
    }
}