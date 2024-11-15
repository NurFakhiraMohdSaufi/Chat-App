import { Timestamp } from 'firebase/firestore';

export interface Message {
    id: string;
    text: string;
    user: string;
    createdAt: Timestamp;
    room: string;
    replyTo: string | null;
}
