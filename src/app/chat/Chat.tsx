import '@/styles/Chat.css';
import '@mdi/font/css/materialdesignicons.min.css';

<<<<<<< HEAD
import imageCompression from 'browser-image-compression';
=======
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
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
<<<<<<< HEAD
    image?: string | null;
=======
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
}

export default function Room({room}: RoomProps) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState('Smileys');
<<<<<<< HEAD
    const [replyToMessageText, setReplyToMessageText] = useState('');
    const [imageFile, setImageFile] = useState<string | null>(null);
=======
    const [replyToMessageText, setReplyToMessageText] = useState(''); // Store replied message text
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messagesRef = collection(db, 'messages');

    useEffect(() => {
<<<<<<< HEAD
=======
        const messagesRef = collection(db, 'messages');
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
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
<<<<<<< HEAD
                    image: data.image || null,
=======
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
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
<<<<<<< HEAD
        if (newMessage === '' && !imageFile) return;
=======
        if (newMessage === '') return;
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad

        const newMessageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room: room,
<<<<<<< HEAD
            replyTo: replyToMessageText || null,
            image: imageFile || null,
        };

        await addDoc(messagesRef, newMessageData);

        setNewMessage('');
        setReplyToMessageText('');
        setImageFile(null);
=======
            replyTo: replyToMessageText || null, // Include the replied message text
        };

        // Add the message to Firestore
        await addDoc(messagesRef, newMessageData);

        // Reset the state after sending the message
        setNewMessage('');
        setReplyToMessageText(''); // Clear the "Replying to" text
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
    };

    const formatTimestamp = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

<<<<<<< HEAD
    const handleKeyDown = (e: React.KeyboardEvent) => {
=======
    const handleKeyDown = (e) => {
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

<<<<<<< HEAD
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
=======
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
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
        if (message.user !== auth.currentUser?.displayName) {
            setReplyToMessageText(message.text);
        }
    };

<<<<<<< HEAD
=======
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

>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <div className='chat-app'>
            <div className='header'>
                <h1 className='header-title'>{room.toUpperCase()}</h1>
<<<<<<< HEAD
=======

<<<<<<< HEAD
                <button className='mdi mdi-dots-vertical option-button'></button>
=======
                <button className='mdi mdi-logout sign-out-button'></button>
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
>>>>>>> 682b7beb368d88c61dd35cf8a0bb389f5a2364b2
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
<<<<<<< HEAD
=======
                        onClick={() =>
                            message.user !== auth.currentUser?.displayName &&
                            handleMessageClick(message)
                        }
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
                    >
                        {message.user !== auth.currentUser?.displayName && (
                            <span className='user'>{message.user}</span>
                        )}
                        <span className='text'>{message.text}</span>

<<<<<<< HEAD
                        {message.image && (
                            <div className='message-image'>
                                <img src={message.image} alt='Image' />
                            </div>
                        )}

=======
                        {/* If the message is a reply, show the replied-to message text */}
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
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
<<<<<<< HEAD

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
=======
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            <form onSubmit={handleSubmit} className='new-message-form'>
                {/* Show the "Replying to" message text if applicable */}
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
                {replyToMessageText && (
                    <div className='replying-to'>
                        <span>Replying to: {replyToMessageText}</span>
                        <button
                            type='button'
                            className='mdi mdi-alpha-x-circle cancel-reply-button'
<<<<<<< HEAD
                            onClick={() => setReplyToMessageText('')}
=======
                            onClick={() => setReplyToMessageText('')} // Clear the reply text
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
                        ></button>
                    </div>
                )}

                <div className='relative flex items-center w-full'>
                    <button
                        type='button'
                        className='mdi mdi-emoticon-outline emoticon-button'
<<<<<<< HEAD
                    ></button>

=======
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

>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
                    <input
                        className='new-message-input'
                        placeholder='Type a message...'
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />

                    <div className='icon-buttons'>
<<<<<<< HEAD
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
=======
                        <button
                            type='button'
                            className='mdi mdi-camera camera-button'
                        ></button>
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
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
