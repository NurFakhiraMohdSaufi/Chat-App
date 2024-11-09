'use client';

import { onAuthStateChanged, User } from 'firebase/auth'; // Firebase auth import
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { auth } from '@/config/firebase-config';

import ListChat from './chat/page';
import Room from './chat/Room';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [room, setRoom] = useState<string | null>(null);
    const [isInChat, setIsInChat] = useState(false);
    const router = useRouter();

    console.log('try room jadi tak', room);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (user === null) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarProvider>
            <AppSidebar setRoom={setRoom} setIsInChat={setIsInChat} />
            <SidebarTrigger />

            {room && <Room room={room} />}
        </SidebarProvider>
    );
}
