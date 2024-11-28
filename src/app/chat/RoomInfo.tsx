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
<<<<<<< HEAD
    const [roomName, setRoomName] = useState('');
    const [idRoom, setIdRoom] = useState('');
    const [imageRoomFile, setImageRoomFile] = useState<string | null>(null);
    const [members, setMembers] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const roomRef = collection(db, 'room');
    const userRoomsRef = collection(db, 'userRooms');

    console.log('imageRoomFile: ', imageRoomFile);

    useEffect(() => {
        const fetchRoomDesc = async () => {
=======
    const [members, setMembers] = useState<string[]>([]); // To store the list of members
    const [open, setOpen] = useState(false);
    const roomRef = collection(db, 'room');
    const userRoomsRef = collection(db, 'userRooms'); // Reference to userRooms collection

    useEffect(() => {
        const fetchRoomData = async () => {
            // Fetch room description
>>>>>>> 4b4b63d63f0e0033b192586014f8c8e4e9293674
            const qRoom = query(roomRef, where('room', '==', room));
            const queryRoomSnapshot = await getDocs(qRoom);
            console.log('queryRoomSnapshot: ', queryRoomSnapshot);

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

        fetchRoomData();
    }, [room]);

<<<<<<< HEAD
    const handleUpdateRoomInfo = async () => {
        const qRoom = query(roomRef, where('room', '==', room)); // change to real room later
=======
    const handleUpdateDesc = async () => {
        const qRoom = query(roomRef, where('room', '==', room));
>>>>>>> 4b4b63d63f0e0033b192586014f8c8e4e9293674
        const queryRoomSnapshot = await getDocs(qRoom);

        if (!queryRoomSnapshot.empty) {
            const roomDocRef = doc(roomRef, queryRoomSnapshot.docs[0].id);

            await updateDoc(roomDocRef, {
                roomDesc: roomDesc,
                room: roomName,
                roomPhotoURL: imageRoomFile,
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

        // Optional: Image compression
        try {
            const options = {
                maxSizeMB: 1, // max file size in MB
                maxWidthOrHeight: 500, // max width or height of image
                useWebWorker: true, // optional for better performance
            };

            const compressedFile = await imageCompression(file, options);

            // Upload the compressed image to Firebase Storage
            const storageRef = ref(
                storage,
                `room_images/${Date.now()}_${compressedFile.name}`,
            );

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
                    className='mdi mdi-information-outline text-black hover:text-white'
                    onClick={() => setOpen(true)}
                ></button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] bg-white overflow-y-auto flex flex-col'>
                <DialogHeader>
                    <DialogTitle>Room Info</DialogTitle>
                    <DialogDescription>
                        Make changes to your room here. Click save when you are
                        done.
                    </DialogDescription>
                </DialogHeader>
<<<<<<< HEAD

                <ScrollArea className='flex-1 overflow-y-auto max-h-[400px]'>
                    <div className='grid gap-4 py-4'>
                        <div className='flex justify-center items-center p-7'>
                            <div className='h-40 w-40 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center'>
                                <img
                                    src={
                                        imageRoomFile ||
                                        'https://static.vecteezy.com/system/resources/previews/026/019/617/original/group-profile-avatar-icon-default-social-media-forum-profile-photo-vector.jpg'
                                    }
                                    width={170}
                                    height={170}
                                    alt='Avatar'
                                />
                            </div>
                            <div className='icon-buttons'>
                                <label
                                    htmlFor='imageRoom-upload'
                                    className='mdi mdi-camera camera-button'
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
                            <Label className='text-base/7 font-semibold text-gray-900'>
                                Room Name:
                            </Label>
                            <Input
                                id='name'
                                value={roomName}
                                className='col-span-3'
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </div>

                        <div className='grid items-center gap-4'>
                            <Label className='text-base/7 font-semibold text-gray-900'>
                                Room Description:
                            </Label>
                            <Input
                                id='name'
                                value={roomDesc}
                                className='col-span-3'
                                onChange={(e) => setRoomDesc(e.target.value)}
                            />
                        </div>
                        {/* Display Room Members */}
                        <div className='grid items-center gap-4'>
                            <h6 className='text-base/7 font-semibold text-gray-900'>
                                Room Member(s):
                            </h6>
                            <ul>
                                {members.length > 0 ? (
                                    members.map((memberId, index) => (
                                        <li
                                            key={index}
                                            className='text-sm text-gray-600'
                                        >
                                            {memberId}
                                        </li>
                                    ))
                                ) : (
                                    <li className='text-sm text-gray-600'>
                                        No members yet
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </ScrollArea>

=======
                <div className='grid gap-4 py-4'>
                    <div className='grid items-center gap-4'>
                        <h3 className='text-base/7 font-semibold text-gray-900'>
                            Room Description:
                        </h3>
                        <br />
                        <Input
                            id='name'
                            value={roomDesc}
                            className='col-span-3'
                            onChange={(e) => setRoomDesc(e.target.value)}
                        />
                    </div>

                    {/* Display Room Members */}
                    <div className='grid items-center gap-4'>
                        <h6 className='text-base/7 font-semibold text-gray-900'>
                            Room Member(s):
                        </h6>
                        <ul>
                            {members.length > 0 ? (
                                members.map((memberId, index) => (
                                    <li
                                        key={index}
                                        className='text-sm text-gray-600'
                                    >
                                        {memberId}
                                    </li>
                                ))
                            ) : (
                                <li className='text-sm text-gray-600'>
                                    No members yet
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
>>>>>>> 4b4b63d63f0e0033b192586014f8c8e4e9293674
                <DialogFooter>
                    <Button type='submit' onClick={handleUpdateRoomInfo}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
