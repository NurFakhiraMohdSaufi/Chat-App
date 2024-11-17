import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { MessageCirclePlusIcon, PlusCircle } from 'lucide-react';
import { useState } from 'react';

import { auth, db } from '@/config/firebase-config';
import {
	Button as MuiButton,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	Snackbar,
	TextField,
} from '@mui/material';

import AddCommentIcon from '';

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
            <IconButton className='bg-whatsapp'>
                <MessageCirclePlusIcon
                    className='justify-between text-sm font-semibold text-whatsapp hover:text-blue-500 '
                    onClick={() => setOpenModal(true)}
                />
            </IconButton>
            // <MuiButton
            //     size='medium'
            //     onClick={() => setOpenModal(true)}
            //     startIcon={<MessageCirclePlusIcon />}
            // >
            //     {/* The button label or content */}
            // </MuiButton>
        );
    };

    return (
        <div className='flex flex-row items-center space-x-4 p-2 border border-md rounded-md'>
            <div className='h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300'>
                <img
                    src='https://th.bing.com/th/id/R.bfa20ea18a0511a19e1e1ab717ccd381?rik=45VUQ8kcO3gXzw&pid=ImgRaw&r=0'
                    width={50}
                    height={50}
                    alt='Avatar'
                    // className='h-full w-full object-cover'
                />
            </div>

            <div className='text-sm font-semibold text-gray-800'>{user}</div>
            <div className='flex-grow items-center'>
                <AddButton />
            </div>

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
