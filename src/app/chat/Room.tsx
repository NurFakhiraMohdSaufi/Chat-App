import '@/styles/Chat.css';
import '@mdi/font/css/materialdesignicons.min.css';

import { unsubscribe } from 'diagnostics_channel';
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import { Dice1 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { auth, db } from '@/config/firebase-config';

import { ProfileUser } from '../profile/ProfileUser';

export default function Room({room}) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showProfile, setShowProfile] = useState(false);

    console.log('test room in a room', room);
    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        if (!room) return;

        const messagesRef = collection(db, 'messages');
        const queryMessages = query(
            messagesRef,
            where('room', '==', room),
            orderBy('createdAt'),
        );

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            const messagesList = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setMessages(messagesList);
        });

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room: room,
        });

        setNewMessage('');
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className='chat-app'>
            <div className='header'>
                <h1 className='header-title'>{room}</h1>
                <button
                    onClick={toggleProfile} // Toggle profile on click
                    className='mdi mdi-account-circle-outline profile-button'
                ></button>
                <label
                    htmlFor='Toggle1'
                    className='inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800'
                >
                    <span className='text-white'>Public</span>
                    <span className='relative'>
                        <input
                            id='Toggle1'
                            type='checkbox'
                            className='hidden peer'
                        />
                        <div className='w-10 h-6 rounded-full shadow-inner dark:bg-gray-600 peer-checked:dark:bg-violet-600'></div>
                        <div className='absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-100'></div>
                    </span>
                    <span className='text-white'>Private</span>
                </label>
            </div>
            <div className='messages'>
                {messages.map((message) => (
                    <div
                        className={`message ${
                            message.user === auth.currentUser.displayName
                                ? 'sent'
                                : 'received'
                        }`}
                        key={message.id}
                    >
                        {message.user !== auth.currentUser.displayName && (
                            <span className='user'>{message.user}</span>
                        )}
                        <span className='text'>{message.text}</span>
                        <span className='timestamp'>
                            {formatTimestamp(message.createdAt)}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className='new-message-form'>
                <div className='relative flex items-center w-full fixed'>
                    <i className='mdi mdi-emoticon-excited-outline emoticon-button'></i>
                    <input
                        className='new-message-input'
                        placeholder='Type your message here...'
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />
                    <i className='mdi mdi-paperclip paperclip-button'></i>
                    <button
                        type='submit'
                        className='mdi mdi-send send-button'
                    ></button>
                </div>
            </form>
        </div>
    );
}
