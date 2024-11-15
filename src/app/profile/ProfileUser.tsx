import Image from 'next/image';

import { auth } from '@/config/firebase-config';

export function ProfileUser() {
    const user = auth.currentUser?.displayName;
    return (
        <div
            className='flex
        flex-col items-center bg-amber-100 border border-gray-200 mt-1 w-full py-6 px-4 rounded-lg'
        >
            <div className='h-20 w-20 rounded-full border overflow-hidden'>
<<<<<<< HEAD
                <img
=======
                <Image
>>>>>>> e29e7927b8024f56ad5742363654f69429036cad
                    src='https://th.bing.com/th/id/R.bfa20ea18a0511a19e1e1ab717ccd381?rik=45VUQ8kcO3gXzw&pid=ImgRaw&r=0'
                    width={90}
                    height={10}
                    alt='Avatar'
                    className='h-full w-full'
                />
            </div>
            <div className='text-sm font-semibold mt-1 text-center'>{user}</div>

            {/* <div className='flex flex-row items-center mt-3'>
                <div className='flex flex-col justify-center h-4 w-8 bg-amber-500 rounded-full'>
                    <div className='h-3 w-3 bg-white rounded-full self-end mr-1'></div>
                </div>
                <div className='leading-none ml-1 text-xs'>Active</div>
            </div> */}
        </div>
    );
}
