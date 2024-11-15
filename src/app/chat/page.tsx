'use client';

import '@/styles/ListChat.css';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Image from 'next/image';
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

interface ChatData {
    [roomName: string]: Message[];
}

export default function ListChat({setRoom, setIsInChat}: RoomProps) {
    const [rooms, setRooms] = useState<
        {roomName: string; messages: Message[]}[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [noRooms, setNoRooms] = useState(false);
    const user = auth.currentUser?.displayName;

    useEffect(() => {
        if (user) {
            const chatRef = collection(db, 'messages');
            const queryChat = query(chatRef, where('user', '==', user));
            const unsubscribe = onSnapshot(queryChat, (snapshot) => {
                const chatData: ChatData = {};

                if (snapshot.empty) {
                    setNoRooms(true);
                } else {
                    setNoRooms(false);
                }

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const room = data.room;

                    const message: Message = {
                        id: doc.id,
                        text: data.text || '',
                        room: room,
                        user: data.user || '',
                    };

                    if (!chatData[room]) {
                        chatData[room] = [];
                    }

                    chatData[room].push(message);
                });

                const roomArray = Object.keys(chatData).map((room) => ({
                    roomName: room,
                    messages: chatData[room],
                }));

                setRooms(roomArray);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleRoomClick = (roomName: string) => {
        setRoom(roomName);
        setIsInChat(true);
    };

    return (
        <div className='flex flex-col mt-1'>
            <div className='flex flex-row items-center justify-between text-xs'>
                <span className='font-bold'>Conversations</span>
            </div>
            <div className='flex flex-col space-y-1 mt-1 -mx-2 h-40 overflow-y-auto'>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress size='30px' />
                    </Box>
                ) : noRooms ? (
                    <div>No recent chat rooms found.</div>
                ) : (
                    rooms.map((room, index) => (
                        <button
                            key={index}
                            className='flex flex-row items-center hover:bg-amber-100 rounded-xl p-2'
                            onClick={() => handleRoomClick(room.roomName)}
                            aria-label={`Chat with ${room.roomName}`}
                        >
                            <div>
<<<<<<< HEAD
                                <img
=======
                                <Image
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
                                    className='flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full'
                                    src='https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg'
                                    width='32'
                                    height='32'
                                    alt='User Profile'
                                />
                            </div>
                            <div className='flex flex-col ml-2'>
                                <h4 className='title-name'>{room.roomName}</h4>
                                <div className='title-chat'>
                                    {
                                        room.messages[room.messages.length - 1]
                                            ?.text
                                    }
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
