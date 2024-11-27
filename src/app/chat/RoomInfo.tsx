import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { db } from '@/config/firebase-config';
import { Input } from '@mui/material';

import { RoomData } from '../../interfaces/RoomData';

interface RoomProps {
    room: string;
}

export function RoomInfo({room}: RoomProps) {
    const [roomDesc, setRoomDesc] = useState('');
    const [members, setMembers] = useState<string[]>([]); // To store the list of members
    const [open, setOpen] = useState(false);
    const roomRef = collection(db, 'room');
    const userRoomsRef = collection(db, 'userRooms'); // Reference to userRooms collection

    useEffect(() => {
        const fetchRoomData = async () => {
            // Fetch room description
            const qRoom = query(roomRef, where('room', '==', room));
            const queryRoomSnapshot = await getDocs(qRoom);

            if (!queryRoomSnapshot.empty) {
                const RoomData = queryRoomSnapshot.docs[0].data();
                setRoomDesc(
                    RoomData.roomDesc || 'No room description available',
                );
            }

            // Fetch room members
            const qMembers = query(userRoomsRef, where('roomId', '==', room));
            const queryMembersSnapshot = await getDocs(qMembers);

            if (!queryMembersSnapshot.empty) {
                const membersList = queryMembersSnapshot.docs.map(
                    (doc) => doc.data().userId,
                );
                setMembers(membersList);
            }
        };

        fetchRoomData();
    }, [room]);

    const handleUpdateDesc = async () => {
        const qRoom = query(roomRef, where('room', '==', room));
        const queryRoomSnapshot = await getDocs(qRoom);

        if (!queryRoomSnapshot.empty) {
            const roomDocRef = doc(roomRef, queryRoomSnapshot.docs[0].id);
            await updateDoc(roomDocRef, {
                roomDesc: roomDesc,
            });
        }

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className='mdi mdi-information-outline description-button'
                    onClick={() => setOpen(true)}
                ></button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] bg-white'>
                <DialogHeader>
                    <DialogTitle>Room Info</DialogTitle>
                    <DialogDescription>
                        Make changes to your room here. Click save when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid items-center gap-4'>
                        <h3 className='text-base/7 font-semibold text-gray-900'>
                            Room Description:
                        </h3>
                        <br />
                        <Input
                            id='name'
                            value={roomDesc}
                            className='col-span-3'
                            onChange={(e) => setRoomDesc(e.target.value)}
                        />
                    </div>

                    {/* Display Room Members */}
                    <div className='grid items-center gap-4'>
                        <h6 className='text-base/7 font-semibold text-gray-900'>
                            Room Member(s):
                        </h6>
                        <ul>
                            {members.length > 0 ? (
                                members.map((memberId, index) => (
                                    <li
                                        key={index}
                                        className='text-sm text-gray-600'
                                    >
                                        {memberId}
                                    </li>
                                ))
                            ) : (
                                <li className='text-sm text-gray-600'>
                                    No members yet
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit' onClick={handleUpdateDesc}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
