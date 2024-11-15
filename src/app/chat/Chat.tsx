import '@/styles/Chat.css';
import '@mdi/font/css/materialdesignicons.min.css';

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
}

export default function Room({room}: RoomProps) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState('Smileys');
    const [replyToMessageText, setReplyToMessageText] = useState(''); // Store replied message text
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
        if (newMessage === '') return;

        const newMessageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room: room,
            replyTo: replyToMessageText || null, // Include the replied message text
        };

        // Add the message to Firestore
        await addDoc(messagesRef, newMessageData);

        // Reset the state after sending the message
        setNewMessage('');
        setReplyToMessageText(''); // Clear the "Replying to" text
    };

    const formatTimestamp = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleEmojiClick = (emoji: string) => {
        setNewMessage((prevMessage) => prevMessage + emoji);
        setShowEmojiPicker(false); // Hide emoji picker after selection
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleCategoryChange = (category: string) => {
        setEmojiCategory(category);
    };

    const handleMessageClick = (message: Message) => {
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
                        onClick={() =>
                            message.user !== auth.currentUser?.displayName &&
                            handleMessageClick(message)
                        }
                    >
                        {message.user !== auth.currentUser?.displayName && (
                            <span className='user'>{message.user}</span>
                        )}
                        <span className='text'>{message.text}</span>

                        {/* If the message is a reply, show the replied-to message text */}
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
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            <form onSubmit={handleSubmit} className='new-message-form'>
                {/* Show the "Replying to" message text if applicable */}
                {replyToMessageText && (
                    <div className='replying-to'>
                        <span>Replying to: {replyToMessageText}</span>
                        <button
                            type='button'
                            className='mdi mdi-alpha-x-circle cancel-reply-button'
                            onClick={() => setReplyToMessageText('')} // Clear the reply text
                        ></button>
                    </div>
                )}

                <div className='relative flex items-center w-full'>
                    <button
                        type='button'
                        className='mdi mdi-emoticon-outline emoticon-button'
                        onClick={toggleEmojiPicker}
                    ></button>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div className='emoji-picker'>
                            <div className='emoji-categories'>
                                {Object.keys(emojis).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            handleCategoryChange(category)
                                        }
                                        className={`emoji-category-button ${
                                            emojiCategory === category
                                                ? 'active'
                                                : ''
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className='emoji-grid'>
                                {emojis[emojiCategory].map((emoji, index) => (
                                    <button
                                        key={index}
                                        type='button'
                                        onClick={() => handleEmojiClick(emoji)}
                                        className='emoji-item'
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        className='new-message-input'
                        placeholder='Type a message...'
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />

                    <div className='icon-buttons'>
                        <button
                            type='button'
                            className='mdi mdi-camera camera-button'
                        ></button>
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
