import 'font-awesome/css/font-awesome.min.css';
import '@/styles/Room.css';

import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { db } from '@/config/firebase-config';

export function SearchRoom({setRoom, setIsInChat}) {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Firestore query to get rooms based on the search term
        const searchRooms = async () => {
            if (roomName.trim() === '') {
                setRooms([]);
                return;
            }

            const q = query(
                collection(db, 'room'),
                where('room', '>=', roomName),
                where('room', '<=', roomName + '\uf8ff'),
            );

            const querySnapshot = await getDocs(q);
            const roomList = querySnapshot.docs.map((doc) => doc.data());
            setRooms(roomList);
        };

        searchRooms();
    }, [roomName]);

    const handleEnterChat = (room) => {
        setRoom(room);
        setIsInChat(true);
        setRoomName('');
        setRooms('');

        console.log('Enter room: ', room);
    };

    return (
        <div className='flex flex-col mt-1'>
            <div className='flex flex-row items-center justify-between text-xs'>
                <span className='font-bold'>Search</span>
            </div>
            <div className='relative mt-2 mb-2'>
                <input
                    type='text'
                    onChange={(e) => setRoomName(e.target.value)}
                    className='px-4 py-2 w-full text-black bg-white border-b border-gray-400 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300'
                    placeholder='Type to search...'
                />
                <i className='fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5'></i>
            </div>

            {rooms.length > 0 && (
                <div className='mt-2'>
                    <ul className='space-y-2'>
                        {rooms.map((room, index) => (
                            <li
                                key={index}
                                onClick={() => handleEnterChat(room.room)}
                                className='cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded-md'
                            >
                                {room.room}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
