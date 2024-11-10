'use client';

import { onAuthStateChanged, User } from 'firebase/auth'; // Firebase auth import
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import LandingPage from '@/app/home/landingPage';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { auth } from '@/config/firebase-config';

import Room from '../chat/Chat';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [room, setRoom] = useState<string | null>(null);
    const [isInChat, setIsInChat] = useState(false);
    const router = useRouter();

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
            {!isInChat ? <LandingPage /> : room && <Room room={room} />}
        </SidebarProvider>
    );
}
