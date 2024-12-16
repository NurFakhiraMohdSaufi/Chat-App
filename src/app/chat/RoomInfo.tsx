import imageCompression from 'browser-image-compression';
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import { db, storage } from '@/config/firebase-config';
import { Input } from '@mui/material';
import { Label } from '@radix-ui/react-dropdown-menu';

interface RoomProps {
    room: string;
}

export function RoomInfo({room}: RoomProps) {
    const [roomDesc, setRoomDesc] = useState('');
    const [roomName, setRoomName] = useState('');
    const [idRoom, setIdRoom] = useState('');
    const [imageRoomFile, setImageRoomFile] = useState<string | null>(null);
    const [members, setMembers] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const roomRef = collection(db, 'room');
    const userRoomsRef = collection(db, 'userRooms');

    useEffect(() => {
        const fetchRoomDesc = async () => {
            const qRoom = query(roomRef, where('room', '==', room));
            const queryRoomSnapshot = await getDocs(qRoom);

            if (!queryRoomSnapshot.empty) {
                const RoomData = queryRoomSnapshot.docs[0].data();
                setRoomDesc(
                    RoomData.roomDesc || 'No room description available',
                );
                setRoomName(RoomData.room);
                setIdRoom(queryRoomSnapshot.docs[0].id);
                setImageRoomFile(RoomData.roomPhotoURL);
            }

            // Fetch room members
            const qMembers = query(userRoomsRef, where('roomId', '==', room));
            const queryMembersSnapshot = await getDocs(qMembers);

            if (!queryMembersSnapshot.empty) {
                const membersList = queryMembersSnapshot.docs.map(
                    (doc) => doc.data().userId,
                );
                setMembers(membersList);
            }
        };

        fetchRoomDesc();
    }, [room]);

    const handleUpdateRoomInfo = async () => {
        const qRoom = query(roomRef, where('room', '==', room)); // change to real room later
        const queryRoomSnapshot = await getDocs(qRoom);

        if (!queryRoomSnapshot.empty) {
            const roomDocRef = doc(roomRef, queryRoomSnapshot.docs[0].id);

            await updateDoc(roomDocRef, {
                roomDesc: roomDesc,
                room: roomName,
                roomPhotoURL: imageRoomFile || '', // fetch roomPhotoURL
            });
        }

        // update name in messages table
        const messageRef = collection(db, 'messages');
        const qMessage = query(messageRef, where('room', '==', room));
        const queryMessageSnapshot = await getDocs(qMessage);

        if (!queryMessageSnapshot.empty) {
            for (const docSnapshot of queryMessageSnapshot.docs) {
                const docRef = doc(messageRef, docSnapshot.id);

                await updateDoc(docRef, {
                    room: roomName,
                });
            }
        }

        // update name in user room table
        const userRoomRef = collection(db, 'userRooms');
        const qUserRoom = query(userRoomRef, where('roomId', '==', room));
        const queryUserRoomSnapshot = await getDocs(qUserRoom);

        if (!queryUserRoomSnapshot.empty) {
            for (const docSnapshot of queryUserRoomSnapshot.docs) {
                const docRef = doc(userRoomRef, docSnapshot.id);

                await updateDoc(docRef, {
                    roomId: roomName,
                });
            }
        }

        setOpen(false);
    };

    const handleEditGroupImages = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            const options = {
                maxSizeMB: 1, // max file size in MB
                maxWidthOrHeight: 500, // max width or height of image
                useWebWorker: true, // optional for better performance
            };

            const compressedFile = await imageCompression(file, options);

            // Upload the compressed image to Firebase Storage
            const storageRef = ref(storage, `room_images/${idRoom}`);

            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Handle progress (optional)
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    // Handle error
                    console.error('Upload failed:', error);
                },
                async () => {
                    // Get the download URL once the upload is complete
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref,
                    );

                    // Update the room photo URL state
                    setImageRoomFile(downloadURL);
                    console.log('File available at', downloadURL);
                },
            );
        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className='mdi mdi-information-outline text-white hover:text-[#86BC25] transition-all duration-300 transform hover:scale-125'
                    onClick={() => setOpen(true)}
                ></button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] bg-black text-white overflow-y-auto flex flex-col'>
                <DialogHeader>
                    <DialogTitle className='text-white'>Room Info</DialogTitle>
                    <DialogDescription className='text-white'>
                        Make changes to your room here. Click save when you are
                        done.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className='flex-1 overflow-y-auto max-h-[400px] hover:border-2 hover:border-[#86BC25] transition-all'>
                    <div className='grid gap-4 py-4'>
                        <div className='flex justify-center items-center p-7'>
                            <div className='h-40 w-40 rounded-full overflow-hidden border-2 border-[#86BC25] flex items-center justify-center hover:scale-105 transition-all'>
                                <Image
                                    src={
                                        imageRoomFile ||
                                        'https://static.vecteezy.com/system/resources/previews/026/019/617/original/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg'
                                    }
                                    width={200}
                                    height={200}
                                    alt='Avatar'
                                    className='transition-transform duration-300'
                                />
                            </div>
                            <div className='absolute top-2 right-0'>
                                <label
                                    htmlFor='imageRoom-upload'
                                    className='mdi mdi-camera text-white hover:text-[#86BC25] transition-all duration-300 transform hover:scale-125'
                                ></label>
                                <input
                                    id='imageRoom-upload'
                                    type='file'
                                    accept='image/*'
                                    style={{display: 'none'}}
                                    onChange={handleEditGroupImages}
                                />
                            </div>
                        </div>
                        <div className='grid items-center gap-4'>
                            <Label className='text-base font-semibold text-white'>
                                Room Name:
                            </Label>
                            <Input
                                id='name'
                                value={roomName}
                                className='col-span-3 bg-black text-white border-[#86BC25] focus:ring-[#86BC25] hover:scale-105 transition-all'
                                onChange={(e) => setRoomName(e.target.value)}
                                style={{color: 'white'}}
                            />
                        </div>

                        <div className='grid items-center gap-4'>
                            <Label className='text-base font-semibold text-white'>
                                Room Description:
                            </Label>
                            <Input
                                id='desc'
                                value={roomDesc}
                                className='col-span-3 bg-black text-white border-[#86BC25] focus:ring-[#86BC25] hover:scale-105 transition-all'
                                onChange={(e) => setRoomDesc(e.target.value)}
                                style={{color: 'white'}}
                            />
                        </div>

                        {/* Display Room Members */}
                        <div className='grid items-center gap-4'>
                            <h6 className='text-base font-semibold text-white'>
                                Room Member(s):
                            </h6>
                            <ul>
                                {members.length > 0 ? (
                                    members.map((memberId, index) => (
                                        <li
                                            key={index}
                                            className='text-sm text-white'
                                        >
                                            {memberId}
                                        </li>
                                    ))
                                ) : (
                                    <li className='text-sm text-white'>
                                        No members yet
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transform hover:scale-105 transition-all duration-300'
                        type='submit'
                        onClick={handleUpdateRoomInfo}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
