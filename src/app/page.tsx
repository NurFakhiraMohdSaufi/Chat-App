'use client';

import '@/styles/Dashboard.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import dashImage from '../dashImage.png';
import logo from '../logo chatify.png';

export default function Dashboard() {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <div className='gradient flex flex-col min-h-screen bg-whatsapp'>
            {/* Navigation Bar */}
            <nav className='w-full z-10 top-0 text-white'>
                <div className='container mx-auto flex justify-between items-center px-4'>
                    <div className='flex items-center space-x-3'>
                        {/* <svg
                            className='h-8 w-8 fill-current text-yellow-700'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                        >
                            <path d='M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z' />
                        </svg> */}
                        <Image
                            className='cursor-pointer'
                            src={logo}
                            width={200}
                            height={200}
                            alt='Chatify Logo'
                        />
                        <h1 className='text-2xl lg:text-4xl font-bold'>
                            Chatify App
                        </h1>
                    </div>
                    <div className='space-x-4'>
                        <button
                            onClick={() => navigateTo('/login')}
                            className='px-6 py-2 rounded bg-white text-gray-800 font-semibold hover:bg-gray-200'
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigateTo('/register')}
                            className='px-6 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-800'
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <header className='container mx-auto flex flex-col items-center text-center py-16 px-4'>
                <h1 className='text-4xl lg:text-5xl font-bold text-white mb-4'>
                    Connect Like Never Before
                </h1>
                <p className='text-lg lg:text-xl text-gray-200 mb-8'>
                    Seamlessly interact and build connections.
                </p>
                <button
                    onClick={() => navigateTo('/register')}
                    className='px-8 py-4 bg-white text-gray-800 rounded-lg font-bold shadow hover:shadow-lg'
                >
                    Get Started
                </button>
                <div className='flex items-center w-full content-end'>
                    <div className='browser-mockup flex flex-1 m-3 md:px-0 md:m-12 bg-white w-full rounded shadow-xl'>
                        <Image
                            src={dashImage}
                            width={1200}
                            height={50}
                            alt='Chatify Logo'
                        />
                    </div>
                </div>
            </header>
            {/* Why Choose Chatify Section */}
            <section className='bg-gray-100 py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                        Why Choose Chatify?
                    </h2>
                    <p className='text-lg text-gray-700 mb-8'>
                        Chatify offers cutting-edge features designed to enhance
                        your communication and collaboration experience.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='bg-white p-6 rounded shadow'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                Real-Time Messaging
                            </h3>
                            <p className='text-gray-600'>
                                Enjoy seamless communication with instant,
                                real-time chat powered by advanced technology.
                            </p>
                        </div>
                        <div className='bg-white p-6 rounded shadow'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                User Authentication
                            </h3>
                            <p className='text-gray-600'>
                                Secure login and registration with
                                email/password.
                            </p>
                        </div>
                        <div className='bg-white p-6 rounded shadow'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                Multiple Chat Rooms
                            </h3>
                            <p className='text-gray-600'>
                                Create and join multiple rooms to chat with
                                different groups.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Features Section
            <section className='bg-white py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                        Premium Features
                    </h2>
                    <div className='flex flex-col lg:flex-row justify-around items-center'>
                        <FeatureCard
                            title='Customizable Themes'
                            description='Personalize your chat experience with a variety of themes and colors.'
                            iconPath='M10 2a8 8 0 100 16 8 8 0 000-16zM8 4h4v8H8z'
                        />
                        <FeatureCard
                            title='Voice and Video Calls'
                            description='Stay connected with crystal-clear voice and video calls.'
                            iconPath='M6 2l4 8-4 8V2zM2 6h2v8H2zm14 0h2v8h-2z'
                        />
                        <FeatureCard
                            title='AI-Powered Chatbot'
                            description='Get instant assistance with our smart AI chatbot.'
                            iconPath='M8 2l4 8-4 8H4V2z'
                        />
                    </div>
                </div>
            </section> */}

            {/* Features Section */}
            <section className='bg-white py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-6'>
                        Trusted By Developers
                    </h2>
                    <div className='flex justify-center items-center space-x-12'>
                        <FeatureCard
                            title='React'
                            description='Modern UI'
                            iconPath='M7 0H6L0 3v6l4-1v12h12V8l4 1V3l-6-3h-1a3 3 0 0 1-6 0z'
                        />
                        <FeatureCard
                            title='Next.js'
                            description='Server-side Power'
                            iconPath='M15.75 8l-3.74-3.75a3.99 3.99 0 0 1 6.82-3.08A4 4 0 0 1 15.75 8zM1.85 15.3l9.2-9.19 2.83 2.83-9.2 9.2-2.82-2.84zm-1.4 2.83l2.11-2.12 1.42 1.42-2.12 2.12-1.42-1.42zM10 15l2-2v7h-2v-5z'
                        />
                        <FeatureCard
                            title='Tailwind CSS'
                            description='Flexible Styling'
                            iconPath='M10 12a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 2.75V20l-4-4-4 4v-8.25a6.97 6.97 0 0 0 8 0z'
                        />
                        <FeatureCard
                            title='ShadCN'
                            description='Flexible Styling'
                            iconPath='M10 12a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 2.75V20l-4-4-4 4v-8.25a6.97 6.97 0 0 0 8 0z'
                        />
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className='bg-whatsapp text-white py-16'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-4xl font-bold mb-4'>
                        Ready to Get Started?
                    </h2>
                    <p className='text-lg mb-8'>
                        Join thousands of users who trust Chatify for their
                        communication needs.
                    </p>
                    <button
                        onClick={() => navigateTo('/register')}
                        className='px-8 py-4 bg-white text-green-700 rounded-lg font-bold shadow hover:shadow-lg'
                    >
                        Create Your Account
                    </button>
                </div>
            </section>
            {/* Footer */}
            <footer className='bg-gray-800 text-gray-400 py-6'>
                <div className='container mx-auto text-center'>
                    <p className='text-sm'>
                        © 2024 Chatify App. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

interface card {
    title: string;
    description: string;
    iconPath: string;
}

function FeatureCard({title, description, iconPath}: card) {
    return (
        <div className='flex flex-col items-center'>
            <svg
                className='h-12 w-12 text-gray-500 mb-2'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
            >
                <path d={iconPath} />
            </svg>
            <h3 className='text-lg font-bold'>{title}</h3>
            <p className='text-sm text-gray-600'>{description}</p>
        </div>
    );
}
