'use client';

import '@/styles/ListChat.css';

import {
	collection,
	onSnapshot,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { auth, db } from '@/config/firebase-config';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface RoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
}

interface Message {
    id: string;
    text: string;
    room: string;
    user: string;
}

export default function ListChat({setRoom, setIsInChat}: RoomProps) {
    // State to hold the list of rooms
    const [rooms, setRooms] = useState<{roomName: string}[]>([]);
    // State to hold messages for each room
    const [message, setMessage] = useState<
        {roomName: string; messages: Message[]}[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [noRooms, setNoRooms] = useState(false);
    const user = auth.currentUser?.displayName;

    useEffect(() => {
        if (user) {
            // Step 1: Fetch rooms based on user
            const chatRef = collection(db, 'messages');
            const queryChat = query(chatRef, where('user', '==', user));

            const unsubscribeRooms = onSnapshot(queryChat, (snapshot) => {
                const roomsList: {roomName: string}[] = [];

                if (snapshot.empty) {
                    setNoRooms(true);
                } else {
                    setNoRooms(false);
                }

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const room = data.room;

                    // Add room to rooms list if it's not already there
                    if (!roomsList.some((r) => r.roomName === room)) {
                        roomsList.push({roomName: room});
                    }
                });

                // Set the rooms state
                setRooms(roomsList);
                setLoading(false);
            });

            return () => unsubscribeRooms();
        }
    }, [user]);

    useEffect(() => {
        if (rooms.length > 0) {
            // Step 2: Fetch messages for each room using onSnapshot for real-time updates
            const unsubscribeMessages = rooms.map((room) => {
                const chatRef = collection(db, 'messages');
                const queryMessages = query(
                    chatRef,
                    where('room', '==', room.roomName),
                    orderBy('createdAt'),
                );

                // Real-time listener for messages in each room
                return onSnapshot(queryMessages, (snapshot) => {
                    const messagesForRoom: Message[] = [];

                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        const message: Message = {
                            id: doc.id,
                            text: data.text || '',
                            room: room.roomName,
                            user: data.user || '',
                        };

                        messagesForRoom.push(message);
                    });

                    // Update the messages state
                    setMessage((prevMessages) => {
                        const updatedMessages = prevMessages.filter(
                            (msg) => msg.roomName !== room.roomName,
                        );
                        updatedMessages.push({
                            roomName: room.roomName,
                            messages: messagesForRoom,
                        });
                        return updatedMessages;
                    });
                });
            });

            return () =>
                unsubscribeMessages.forEach((unsubscribe) => unsubscribe());
        }
    }, [rooms]);

    const handleRoomClick = (roomName: string) => {
        setRoom(roomName);
        setIsInChat(true);
    };

    return (
        <div className='list-container'>
            <div>
                <span className='header-convo'>Conversations</span>
            </div>
            <div className='card-list'>
                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress size='30px' />
                    </Box>
                ) : noRooms ? (
                    <div>No recent chat rooms found.</div>
                ) : (
                    rooms.map((room, index) => (
                        <button
                            key={index}
                            className='button-chat'
                            onClick={() => handleRoomClick(room.roomName)}
                            aria-label={`Chat with ${room.roomName}`}
                        >
                            <div>
                                <img
                                    className='flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full'
                                    src='https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg'
                                    width='32'
                                    height='32'
                                    alt='User Profile'
                                />
                            </div>
                            <div className='chat-list'>
                                <h4 className='title-name'>{room.roomName}</h4>
                                {message.map(
                                    (chat) =>
                                        chat.roomName === room.roomName && (
                                            <div
                                                className='title-chat'
                                                key={chat.roomName}
                                            >
                                                {chat.messages.length > 0
                                                    ? chat.messages[
                                                          chat.messages.length -
                                                              1
                                                      ]?.user === user
                                                        ? `Me: ${
                                                              chat.messages[
                                                                  chat.messages
                                                                      .length -
                                                                      1
                                                              ]?.text
                                                          }`
                                                        : `${
                                                              chat.messages[
                                                                  chat.messages
                                                                      .length -
                                                                      1
                                                              ]?.user
                                                          }: ${
                                                              chat.messages[
                                                                  chat.messages
                                                                      .length -
                                                                      1
                                                              ]?.text
                                                          }`
                                                    : 'No messages'}
                                            </div>
                                        ),
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
