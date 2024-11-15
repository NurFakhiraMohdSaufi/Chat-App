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

interface RoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
}

export function AppSidebar({setRoom, setIsInChat}: RoomProps) {
    const user = auth.currentUser?.displayName;

    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove('auth-token');
        // setIsAuth(false);
        setIsInChat(false);
    };
    return (
        <Sidebar className=' bg-gray-800 text-white'>
            <SidebarHeader className='flex items-center justify-between border-b border-gray-700'>
                <h1 className='text-2xl font-bold text-whatsapp'>Chat App</h1>
            </SidebarHeader>
            <SidebarContent className='h-full overflow-y-auto flex-grow  border-b border-gray-700'>
                <SidebarGroup>
                    <ProfileUser setRoom={setRoom} setIsInChat={setIsInChat} />
                    <SidebarGroupContent className='flex flex-col h-full'>
                        <SidebarMenu className='flex-grow mt-2'>
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

            <SidebarFooter className='mt-auto'>
                <button
                    className='items-center justify-between text-sm font-semibold text-whatsapp hover:text-red-500 '
                    onClick={signUserOut}
                >
                    Sign Out
                </button>
            </SidebarFooter>

            {/* Modal for creating new room */}
        </Sidebar>
    );
}
