import express, { Request, Response } from 'express';
// import { RTCPeerConnection, RTCSessionDescription, MediaStream } from 'wrtc';

const app = express();
let senderStream: MediaStream | undefined;

app.use(express.static('public'));
app.use(express.json());

app.post('/consumer', async (req: Request, res: Response) => {
    try {
        console.log('consumer', req.body);

        const sdp: string = req.body.offer;
        const offer: RTCSessionDescriptionInit = {
            sdp,
            type: 'offer',
        };

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                    ],
                },
            ],
        });

        const desc = new RTCSessionDescription(offer);
        await peer.setRemoteDescription(desc);

        if (senderStream) {
            senderStream.getTracks().forEach((track: any) => peer.addTrack(track, senderStream!));
        }

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        res.json(peer.localDescription);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

app.post('/broadcast', async (req: Request, res: Response) => {
    try {
        const sdp: string = req.body.offer;
        const offer: RTCSessionDescriptionInit = {
            sdp,
            type: 'offer',
        };

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                    ],
                },
            ],
        });

        peer.ontrack = (e: RTCTrackEvent) => handleTrackEvent(e);

        const desc = new RTCSessionDescription(offer);
        await peer.setRemoteDescription(desc);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        res.json(peer.localDescription);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/v1', (req: Request, res: Response) => {
    res.json({ message: 'running' });
});

function handleTrackEvent(event: RTCTrackEvent) {
    senderStream = event.streams[0];
}

app.listen(5000, () => console.log('Server started on port 5000'));
