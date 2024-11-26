import '@/styles/Chat.css';
import '@mdi/font/css/materialdesignicons.min.css';

import imageCompression from 'browser-image-compression';
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	where,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import React, { useEffect, useRef, useState } from 'react';

import { auth, db } from '@/config/firebase-config';

interface RoomProps {
    room: string;
}

interface Message {
    id: string;
    text: string;
    user: string;
    createdAt: Timestamp;
    room: string;
    replyTo: string | null;
    image?: string | null;
}

export default function Room({room}: RoomProps) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState('Smileys');
    const [replyToMessageText, setReplyToMessageText] = useState('');
    const [imageFile, setImageFile] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const queryMessages = query(
            messagesRef,
            where('room', '==', room),
            orderBy('createdAt'),
        );

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            const messages: Message[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();

                const message: Message = {
                    id: doc.id,
                    text: data.text || '',
                    user: data.user || 'Unknown',
                    createdAt: data.createdAt || null,
                    room: data.room || room,
                    replyTo: data.replyTo || null,
                    image: data.image || null,
                };

                messages.push(message);
            });

            setMessages(messages);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage === '' && !imageFile) return;

        const newMessageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room: room,
            replyTo: replyToMessageText || null,
            image: imageFile || null,
        };

        await addDoc(messagesRef, newMessageData);
        sendNotificationToUsers(newMessageData);
        setNewMessage('');
        setReplyToMessageText('');
        setImageFile(null);
    };

    const sendNotificationToUsers = async (messageData) => {
        const payload = {
            notification: {
                title: `${messageData.user} sent a message`,
                body: messageData.text,
            },
            topic: 'chatroom_' + room,
        };

        try {
            const response = await fetch(
                'https://fcm.googleapis.com/fcm/send',
                {
                    method: 'POST',
                    headers: {
                        Authorization: '',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                },
            );
            console.log('Notification sent successfully:', response);
        } catch (error) {
            console.error('Error sending notification: ', error);
        }
    };

    const formatTimestamp = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handleKeyDown = (e: React.KeyboardEvent<Element>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setImageFile(base64String);
                };

                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleReplyClick = (message: Message) => {
        if (message.user !== auth.currentUser?.displayName) {
            setReplyToMessageText(message.text);
        }
    };

    const emojis = {
        Smileys: [
            '😊',
            '😂',
            '😍',
            '❤️',
            '😁',
            '😜',
            '😎',
            '🤔',
            '🥺',
            '🤗',
            '😢',
            '🥳',
        ],
        Animals: ['🐶', '🐱', '🐯', '🐸', '🦁', '🐯', '🦊', '🐻', '🦄', '🐨'],
        Food: ['🍏', '🍔', '🍕', '🍣', '🍩', '🍪', '🍔', '🍓', '🍉', '🍍'],
        Objects: ['💻', '📱', '📸', '🎧', '💼', '📚', '🏠', '🚗', '⚽'],
        Travel: ['🌍', '🌎', '🏖️', '🗽', '🏕️', '🚢', '✈️', '🚉'],
        Symbols: ['❤️', '💔', '💯', '👍', '👎', '✨', '🔥', '⚡'],
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <div className='chat-app'>
            <div className='header'>
                <h1 className='header-title'>{room.toUpperCase()}</h1>

                <button className='mdi mdi-dots-vertical option-button'></button>
            </div>

            <div className='messages'>
                {messages.map((message) => (
                    <div
                        className={`message ${
                            message.user === auth.currentUser?.displayName
                                ? 'sent'
                                : 'received'
                        }`}
                        key={message.id}
                    >
                        {message.user !== auth.currentUser?.displayName && (
                            <span className='user'>{message.user}</span>
                        )}
                        <span className='text'>{message.text}</span>

                        {message.image && (
                            <div className='message-image'>
                                <img src={message.image} alt='Image' />
                            </div>
                        )}

                        {message.replyTo && (
                            <div className='reply-info'>
                                <span className='reply-to'>
                                    Replying to: {message.replyTo}
                                </span>
                            </div>
                        )}

                        <span className='timestamp'>
                            {formatTimestamp(message.createdAt)}
                        </span>

                        {/* Reply Button */}
                        {message.user !== auth.currentUser?.displayName && (
                            <button
                                className='mdi mdi-reply reply-button'
                                onClick={() => handleReplyClick(message)}
                            ></button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className='new-message-form'>
                {replyToMessageText && (
                    <div className='replying-to'>
                        <span>Replying to: {replyToMessageText}</span>
                        <button
                            type='button'
                            className='mdi mdi-alpha-x-circle cancel-reply-button'
                            onClick={() => setReplyToMessageText('')}
                        ></button>
                    </div>
                )}

                <div className='relative flex items-center w-full'>
                    <button
                        type='button'
                        className='mdi mdi-emoticon-outline emoticon-button'
                    ></button>

                    <input
                        className='new-message-input'
                        placeholder='Type a message...'
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />

                    <div className='icon-buttons'>
                        <label
                            htmlFor='image-upload'
                            className='mdi mdi-camera camera-button'
                        ></label>
                        <input
                            id='image-upload'
                            type='file'
                            accept='image/*'
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        type='submit'
                        className='mdi mdi-send send-button'
                    ></button>
                </div>
            </form>
        </div>
    );
}
