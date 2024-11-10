import '@/styles/Room.css';

import { signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import Cookies from 'universal-cookie';

import ListChat from '@/app/chat/page';
import { SearchRoom } from '@/app/chat/SearchRoom';
import { ProfileUser } from '@/app/profile/ProfileUser';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { auth, db } from '@/config/firebase-config';
import {
	Button as MuiButton,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
} from '@mui/material';

const cookies = new Cookies();

export function AppSidebar({setRoom, setIsInChat}) {
    const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
    const [openModal, setOpenModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const user = auth.currentUser?.displayName;

    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove('auth-token');
        setIsAuth(false);
        setIsInChat(false);
    };

    const handleCreateNewRoom = async (e) => {
        e.preventDefault();
        if (roomName.trim() === '') {
            setError('Room name cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await addDoc(collection(db, 'room'), {
                room: roomName,
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser?.displayName,
            });

            setRoom(roomName);
            setIsInChat(true);
            setRoomName('');
            setOpenModal(false);
            setSuccess(true);
        } catch (err) {
            setError('Failed to create room. Please try again.');
            console.log('error create: ', err);
        } finally {
            setLoading(false);
        }
    };

    const AddButton = () => {
        return (
            <MuiButton size='medium' onClick={() => setOpenModal(true)}>
                <PlusCircle />
                <span className='text-xs ml-2 text-black font-bold'>
                    Create New Group
                </span>
            </MuiButton>
        );
    };

    return (
        <Sidebar className='h-screen flex flex-col bg-neutral-700'>
            <SidebarHeader>
                <SidebarContent className='h-full overflow-y-auto flex-grow'>
                    <SidebarGroup>
                        <SidebarGroupLabel>Chat App</SidebarGroupLabel>
                        <SidebarGroupContent className='flex flex-col h-full'>
                            <ProfileUser />
                            <SidebarMenu className='flex-grow mt-2'>
                                <AddButton />
                                <SidebarMenuItem>
                                    <SearchRoom
                                        setRoom={setRoom}
                                        setIsInChat={setIsInChat}
                                    />
                                    <ListChat
                                        setRoom={setRoom}
                                        setIsInChat={setIsInChat}
                                    />
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </SidebarHeader>

            <SidebarFooter className='mt-auto'>
                <div className='mt-4 lg:mt-0 lg:flex text-left text-sm'>
                    {user}
                </div>
                <div className='mt-4 lg:mt-0 lg:flex '>
                    <button
                        className='text-sm font-semibold text-gray-300 hover:text-red-500'
                        onClick={signUserOut}
                    >
                        Sign Out <span aria-hidden='true'>&rarr;</span>
                    </button>
                </div>
            </SidebarFooter>

            {/* Modal for creating new room */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    <div className='card-input'>
                        <input
                            type='text'
                            className='input-room'
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder='New Group'
                            value={roomName}
                        />
                        {error && (
                            <div className='text-red-500 text-sm'>{error}</div>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => setOpenModal(false)}
                        color='secondary'
                    >
                        Cancel
                    </MuiButton>
                    <MuiButton
                        onClick={handleCreateNewRoom}
                        color='primary'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                message='Room created successfully!'
            />
        </Sidebar>
    );
}
