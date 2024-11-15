import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

import { auth, db } from '@/config/firebase-config';
import {
	Button as MuiButton,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	Snackbar,
	TextField,
} from '@mui/material';

interface RoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
}

export function ProfileUser({setRoom, setIsInChat}: RoomProps) {
    const user = auth.currentUser?.displayName;
    const [openModal, setOpenModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
            setOpenModal(false);
            setSuccess(true);
        } catch (err) {
            setError('Failed to create room. Please try again.');
            console.error('Error creating room: ', err);
        } finally {
            setLoading(false);
        }
    };

    const AddButton = () => {
        return (
            <MuiButton
                size='medium'
                onClick={() => setOpenModal(true)}
                startIcon={<PlusCircle />}
            ></MuiButton>
        );
    };

    return (
<<<<<<< HEAD
        <div className='flex flex-row items-center space-x-2 p-2'>
            {/* Avatar */}
            <div className='h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300'>
                <img
=======
        <div
            className='flex
        flex-col items-center bg-amber-100 border border-gray-200 mt-1 w-full py-6 px-4 rounded-lg'
        >
            <div className='h-20 w-20 rounded-full border overflow-hidden'>
<<<<<<< HEAD
                <img
=======
                <Image
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
>>>>>>> 682b7beb368d88c61dd35cf8a0bb389f5a2364b2
                    src='https://th.bing.com/th/id/R.bfa20ea18a0511a19e1e1ab717ccd381?rik=45VUQ8kcO3gXzw&pid=ImgRaw&r=0'
                    width={50}
                    height={50}
                    alt='Avatar'
                    // className='h-full w-full object-cover'
                />
            </div>

            {/* User Name */}
            <div className='text-sm font-semibold text-gray-800'>{user}</div>

            {/* Add Room Button */}
            <AddButton />

            {/* Create Room Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogContent>
                    <div className='card-input'>
                        <TextField
                            variant='outlined'
                            fullWidth
                            label='Room Name'
                            placeholder='New Group'
                            value={roomName}
                            onChange={(e) => {
                                setRoomName(e.target.value);
                                if (error) setError('');
                            }}
                            error={Boolean(error)}
                            helperText={error || ''}
                            autoFocus
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => setOpenModal(false)}
                        color='secondary'
                        variant='outlined'
                    >
                        Cancel
                    </MuiButton>
                    <MuiButton
                        onClick={handleCreateNewRoom}
                        color='primary'
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Success */}
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                message='Room created successfully!'
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                sx={{mt: 2}}
            />
        </div>
    );
}
