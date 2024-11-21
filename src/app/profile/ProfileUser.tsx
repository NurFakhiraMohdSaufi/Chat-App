import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { MessageCirclePlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { auth, db } from '@/config/firebase-config';
import {
	Button as MuiButton,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Snackbar,
	TextField,
} from '@mui/material';

import { EditProfile } from './EditProfile';

export function ProfileUser() {
    const [userName, setUserName] = useState('');
    const userData = auth.currentUser;

    useEffect(() => {
        if (userData?.displayName) {
            setUserName(userData.displayName);
        }
    }, [userData]);

    return (
        <div className='flex flex-row items-center space-x-4 p-2 '>
            <div className='cursor-pointer h-10 w-10 rounded-full overflow-hidden '>
                {/* <img
                    src='https://th.bing.com/th/id/R.bfa20ea18a0511a19e1e1ab717ccd381?rik=45VUQ8kcO3gXzw&pid=ImgRaw&r=0'
                    width={50}
                    height={50}
                    alt='Avatar'
                    // className='h-full w-full object-cover'
                /> */}

                <EditProfile />
            </div>

            <div className='flex-grow text-sm font-semibold text-gray-800'>
                {userName}
            </div>
        </div>
    );
}
