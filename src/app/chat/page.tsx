'use client';

import '@/styles/ListChat.css';

import {
	collection,
	DocumentData,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { auth, db } from '@/config/firebase-config';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function ListChat({setRoom, setIsInChat}) {
    const [rooms, setRooms] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [noRooms, setNoRooms] = useState(false);
    const user = auth.currentUser?.displayName;

    useEffect(() => {
        if (user) {
            const chatRef = collection(db, 'messages');
            const queryChat = query(chatRef, where('user', '==', user));
            const unsubscribe = onSnapshot(queryChat, (snapshot) => {
                const chatData = {};
                if (snapshot.empty) {
                    setNoRooms(true);
                } else {
                    setNoRooms(false);
                }

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const room = data.room;

                    if (!chatData[room]) {
                        chatData[room] = [];
                    }
                    chatData[room].push({...data, id: doc.id});
                });

                const roomArray = Object.keys(chatData).map((room) => ({
                    roomName: room,
                    messages: chatData[room],
                }));
                setRooms(roomArray);
                console.log('array', rooms);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleRoomClick = (roomName) => {
        setRoom(roomName);
        setIsInChat(true);
        console.log('handle room click', roomName);
    };

    console.log('Rooms data: ', rooms);

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
                            className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'
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
