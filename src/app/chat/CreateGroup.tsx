import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { MessageCirclePlusIcon } from 'lucide-react';
import { useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/config/firebase-config';
import { Button, IconButton, TextField } from '@mui/material';
import { Label } from '@radix-ui/react-dropdown-menu';

interface RoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
}

export function CreateGroup({setRoom, setIsInChat}: RoomProps) {
    const [open, setOpen] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const userData = auth.currentUser;

    const handleCreateNewRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roomName.trim() === '') {
            setError('Room name cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Create a new room
            await addDoc(collection(db, 'room'), {
                room: roomName,
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser?.displayName,
            });

            // Add user to userRooms collection
            await addDoc(collection(db, 'userRooms'), {
                userId: auth.currentUser?.displayName,
                roomId: roomName,
                joinedAt: serverTimestamp(),
            });

            setRoom(roomName);
            setIsInChat(true);
            setRoomName('');
            setOpen(false);
            setSuccess(true);
        } catch (err) {
            setError('Failed to create room. Please try again.');
            console.error('Error creating room: ', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const AddButton = () => {
        <IconButton className='bg-whatsapp'>
            <MessageCirclePlusIcon
                className='justify-between text-sm font-semibold text-whatsapp hover:text-blue-500'
                onClick={() => setOpen(true)}
            />
        </IconButton>;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <IconButton className='bg-whatsapp'>
                    <MessageCirclePlusIcon
                        className='justify-between text-sm font-semibold text-whatsapp hover:text-blue-500'
                        onClick={() => setOpen(true)}
                    />
                </IconButton>
            </DialogTrigger>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 items-center gap-4'>
                    <Input
                        className='col-span-2'
                        placeholder='New Group'
                        value={roomName}
                        onChange={(e) => {
                            setRoomName(e.target.value);
                            if (error) setError('');
                        }}
                        // error={Boolean(error)}
                        // helperText={error || ''}
                        autoFocus
                    />
                </div>

                <DialogFooter>
                    <Button
                        type='submit'
                        className='text-black'
                        onClick={handleCreateNewRoom}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
