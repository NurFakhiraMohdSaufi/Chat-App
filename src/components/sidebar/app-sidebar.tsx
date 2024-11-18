import '@/styles/Room.css';

import { signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DeleteIcon, LogOutIcon, PlusCircle } from 'lucide-react';
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
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/config/firebase-config';
import { IconButton } from '@mui/material';

const cookies = new Cookies();

interface RoomProps {
    setRoom: (roomName: string) => void;
    setIsInChat: (isInChat: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function AppSidebar({
    setRoom,
    setIsInChat,
    isSidebarOpen,
    toggleSidebar,
}: RoomProps) {
    // const user = auth.currentUser?.displayName;

    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove('auth-token');
        // setIsAuth(false);
        setIsInChat(false);
    };
    return (
        <Sidebar
            className={`bg-gray-800 text-white ${
                isSidebarOpen ? 'block' : 'hidden'
            }`}
        >
            <div className='flex items-center justify-between border-b border-gray-700'>
                <SidebarHeader>
                    <h1 className='text-2xl font-bold text-whatsapp'>
                        Chatify
                    </h1>
                </SidebarHeader>

                <SidebarTrigger onClick={toggleSidebar} />
            </div>

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

            <SidebarFooter>
                <div className='items-right'>
                    <IconButton>
                        <LogOutIcon
                            className='justify-between text-sm font-semibold text-whatsapp hover:text-red-500 '
                            onClick={signUserOut}
                        />
                    </IconButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
