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
import React, { useEffect, useRef, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { auth, db } from '@/config/firebase-config';

import { RoomInfo } from './RoomInfo';

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
    const [replyToMessageText, setReplyToMessageText] = useState<string | null>(
        '',
    );
    const [imageFile, setImageFile] = useState<string | null>(null); // Image file state
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesRef = collection(db, 'messages');

    // Fetch messages from Firebase
    useEffect(() => {
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

    // Submit message
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
        setNewMessage('');
        setReplyToMessageText('');
        setImageFile(null);
    };

    const formatTimestamp = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    // Handle Enter key press for message submit
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Handle image file change and compression
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

    // Handle remove image preview
    const handleRemoveImagePreview = () => {
        setImageFile(null);
    };

    // Handle reply to a message
    const handleReplyClick = (message: Message) => {
        if (message.user !== auth.currentUser?.displayName) {
            setReplyToMessageText(message.text || 'Image');
        }
    };

    // Handle emoji click
    const handleEmojiClick = (emoji: string) => {
        setNewMessage((prevMessage) => prevMessage + emoji);
        setShowEmojiPicker(false); // Close the emoji picker after selecting
    };

    // Emoji categories and emojis
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
        Animals: ['🐶', '🐱', '🐯', '🐸', '🦁', '🦊', '🐻', '🦄', '🐨'],
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

    // const refreshChatInfo = async () => {
    //     if (userData) {
    //         await userData.reload();
    //         setUserName(userData?.displayName || '');
    //     }
    // };

    // const handleDescEdit = async () => {
    //     await refreshChatInfo();
    // };

    return (
        <div className='chat-app'>
            <div className='header'>
                <h1 className='header-title'>{room.toUpperCase()}</h1>
                <RoomInfo room={room} />
            </div>

            <ScrollArea className='h-screen'>
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
                                    <img
                                        src={message.image}
                                        alt='Image'
                                        onClick={() =>
                                            handleReplyClick(message)
                                        }
                                    />
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
            </ScrollArea>

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

                {/* Image Preview Section */}
                {imageFile && (
                    <div className='image-preview'>
                        <img src={imageFile} alt='Image preview' />
                        <button
                            type='button'
                            className='mdi mdi-close-circle close-preview-button'
                            onClick={handleRemoveImagePreview}
                        ></button>
                    </div>
                )}

                <div className='relative flex items-center w-full'>
                    <button
                        type='button'
                        className='mdi mdi-emoticon-outline emoticon-button'
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className='emoji-picker'>
                        {Object.keys(emojis).map((category) => (
                            <div key={category}>
                                <h4>{category}</h4>
                                <div className='emoji-category'>
                                    {emojis[category].map((emoji) => (
                                        <span
                                            key={emoji}
                                            onClick={() =>
                                                handleEmojiClick(emoji)
                                            }
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}
