declare module 'wrtc' {
    export class RTCPeerConnection {
        constructor(configuration?: RTCConfiguration);
        createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
        createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit>;
        setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;
        setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
        addTrack(track: MediaStreamTrack, stream: MediaStream): RTCRtpSender;
        ontrack: (event: RTCTrackEvent) => void;
        localDescription: RTCSessionDescription | null;
    }

    export class RTCSessionDescription {
        constructor(descriptionInitDict: RTCSessionDescriptionInit);
        type: RTCSdpType;
        sdp: string;
    }

    export class MediaStream {
        getTracks(): MediaStreamTrack[];
    }

    export interface RTCTrackEvent {
        streams: MediaStream[];
    }

    export interface RTCRtpSender {}

    export type RTCSdpType = 'offer' | 'answer' | 'pranswer' | 'rollback';
    export interface RTCConfiguration {
        iceServers?: RTCIceServer[];
    }
    export interface RTCIceServer {
        urls: string | string[];
        username?: string;
        credential?: string;
    }
    export interface RTCOfferOptions {}
    export interface RTCAnswerOptions {}
}
