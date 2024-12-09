import Image from 'next/image';

import logo from '@/logo chatify.png';

export default function LandingPage() {
    return (
        <div className='bg-black w-full h-screen flex items-center justify-center relative overflow-hidden'>
            <div
                className='absolute inset-0 bg-cover bg-center bg-opacity-30'
                // style={{backgroundImage: "url('/path-to-your-image.jpg')"}}
            ></div>

            <div className='z-10 text-center text-white'>
                <div className='text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 animate__animated animate__fadeIn animate__delay-1s'>
                    Welcome to Chatify
                </div>
                <div className='place-items-center m-7'>
                    <Image
                        src={logo}
                        width={300}
                        height={300}
                        alt='Chat App Logo'
                    />
                </div>
                <p className='text-xl text-bold text-white sm:text-2xl mb-6 opacity-80 animate__animated animate__fadeIn animate__delay-2s'>
                    Start a conversation now!
                </p>

                {/* <button className='px-6 py-3 bg-black text-amber-100 text-lg font-semibold rounded-lg shadow-lg hover:bg-amber-500 transition-colors duration-300'>
                    Get Started
                </button> */}
            </div>
        </div>
    );
}
