import imageCompression from 'browser-image-compression';
import { updateProfile } from 'firebase/auth';
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth, db, storage } from '@/config/firebase-config';
import { Label } from '@radix-ui/react-dropdown-menu';

export function UserImage() {
    const user = auth.currentUser?.displayName ?? '';
    const userData = auth.currentUser;
    const [userName, setUserName] = useState('');
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const userRef = collection(db, 'users');

    useEffect(() => {
        if (userData?.displayName) {
            setUserName(userData.displayName);
        }
    }, [userData]);

    const handleUpdateName = async () => {
        try {
            if (userData) {
                // Update the display name in Firebase Authentication
                await updateProfile(userData, {
                    displayName: userName,
                    photoURL: imageFile,
                });

                const q = query(userRef, where('name', '==', user));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDocRef = doc(userRef, querySnapshot.docs[0].id); // Get the user document reference
                    await updateDoc(userDocRef, {
                        name: userName,
                        photoURL: imageFile,
                    });
                }
            }

            setOpen(false);
        } catch (error) {
            console.error('Error updating name: ', error);
        }
    };

    const handleEditImage = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };

                // Compress the image
                const compressedFile = await imageCompression(file, options);

                // Create a storage reference for the image
                const storageRef = ref(
                    storage,
                    `profile_images/${userData?.uid}`,
                );

                // Upload the compressed image to Firebase Storage
                const uploadTask = uploadBytesResumable(
                    storageRef,
                    compressedFile,
                );

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {},
                    (error) => {
                        console.error('Error uploading image:', error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref,
                        );
                        setImageFile(downloadURL);
                    },
                );
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <img
                    src={
                        userData?.photoURL ||
                        'https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg'
                    }
                    width={50}
                    height={50}
                    alt='Avatar'
                    onClick={() => setOpen(true)}
                />
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] bg-white text-black'>
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
                                src={
                                    imageFile || // Show the updated image if available
                                    userData?.photoURL ||
                                    'https://i.pinimg.com/736x/d2/98/4e/d2984ec4b65a8568eab3dc2b640fc58e.jpg'
                                }
                                width={170}
                                height={170}
                                alt='Avatar'
                            />
                        </div>
                        <div className='icon-buttons'>
                            <label
                                htmlFor='image-upload'
                                className='mdi mdi-camera camera-button'
                            ></label>
                            <input
                                id='image-upload'
                                type='file'
                                accept='image/*'
                                style={{display: 'none'}}
                                onChange={handleEditImage}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Name</Label>
                        <Input
                            className='col-span-3'
                            value={userName}
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
