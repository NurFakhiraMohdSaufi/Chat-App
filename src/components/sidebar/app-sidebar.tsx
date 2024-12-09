import '@/styles/Room.css';

import { signOut } from 'firebase/auth';
import { LogOutIcon } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'universal-cookie';

import ListChat from '@/app/chat/page';
import { SearchRoom } from '@/app/chat/SearchRoom';
import { ProfileUser } from '@/app/profile/ProfileUser';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import logo from '@/logo chatify.png';
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
            <div className='flex items-center justify-between border-b border-gray-700 p-1 h-14'>
                <SidebarHeader>
                    <Image
                        src={logo}
                        width={100}
                        height={100}
                        alt='Chatify Logo'
                    />
                </SidebarHeader>

                <SidebarTrigger onClick={toggleSidebar} />
            </div>

            <ScrollArea>
                <SidebarContent className='border-b border-gray-700'>
                    <SidebarGroup>
                        <SidebarGroupContent className='flex flex-col'>
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
            </ScrollArea>

            <SidebarFooter>
                <div className='flex flex-row justify-between items-center'>
                    <div className='relative flex-grow'>
                        <ProfileUser
                            setRoom={setRoom}
                            setIsInChat={setIsInChat}
                        />
                    </div>
                    <div className='ml-2'>
                        <IconButton>
                            <LogOutIcon
                                className='justify-between text-sm font-semibold text-whatsapp hover:text-red-500'
                                onClick={signUserOut}
                            />
                        </IconButton>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
