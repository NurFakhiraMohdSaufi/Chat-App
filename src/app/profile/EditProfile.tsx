import { updateProfile } from 'firebase/auth';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth } from '@/config/firebase-config';
import { DialogTitle } from '@mui/material';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-dropdown-menu';

export function UserImage() {
    const user = auth.currentUser?.displayName ?? '';
    const userData = auth.currentUser ?? '';
    const userPicture = auth.currentUser?.photoURL;
    const [userName, setUserName] = useState('');

    console.log('username: ', userName);

    const handleUpdateName = () => {
        updateProfile(userData, {
            displayName: userName,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <img
                    src='https://th.bing.com/th/id/R.bfa20ea18a0511a19e1e1ab717ccd381?rik=45VUQ8kcO3gXzw&pid=ImgRaw&r=0'
                    width={50}
                    height={50}
                    alt='Avatar'
                    // className='h-full w-full object-cover'
                />
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] text-white'>
                <DialogHeader>
                    <DialogTitle className='text-left font-bold'>
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='flex justify-center items-center p-7'>
                        <div className='h-40 w-40 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center'>
                            <img
                                src='https://th.bing.com/th/id/R.bfa20ea18a0511a19e1e1ab717ccd381?rik=45VUQ8kcO3gXzw&pid=ImgRaw&r=0'
                                width={170}
                                height={170}
                                alt='Avatar'
                            />
                        </div>
                        <Button>Edit picture</Button>
                    </div>

                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Name</Label>
                        <Input
                            className='col-span-3'
                            // value={user}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit' onClick={handleUpdateName}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
