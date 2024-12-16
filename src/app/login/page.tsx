'use client';
import '@/styles/Auth.css';

import {
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'universal-cookie';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { auth, provider } from '@/config/firebase-config';
import logo from '@/logo chatify.png';

const cookies = new Cookies();

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set('auth-token', result.user.refreshToken);
            // setIsAuth(true);
            // alert('Successfully logged in!');
            router.push('/home'); // Redirect to home page after login
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google');
        }
    };

    const signInWithEmailPassword = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = result.user;
            console.log('user: ', user);

            if (!user.emailVerified) {
                alert('Please verify your email before logging in.');
                setIsSubmitting(false);
                return;
            }

            cookies.set('auth-token', result.user.refreshToken);
            alert('Successfully logged in!');
            router.push('/home'); // Redirect to home page after login
            // setIsAuth(true);
            setError('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        }
        setIsSubmitting(false);
    };

    const forgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error(error);
        }
    };

    const registerButton = () => {
        router.push('/register');
    };

    const homeButton = () => {
        router.push('/');
    };

    return (
        <div className=' auth-container'>
            <svg
                viewBox='0 0 500 150'
                preserveAspectRatio='none'
                className='w-full'
            >
                <defs>
                    <linearGradient
                        id='myGradient'
                        gradientTransform='rotate(90)'
                    >
                        <stop offset='5%' stopColor='#86BC25' />
                        <stop offset='95%' stopColor='#86BC25' />
                    </linearGradient>
                </defs>
                <path
                    d='M208.09,0.00 C152.70,67.10 262.02,75.98 200.80,150.00 L0.00,150.00 L0.00,0.00 Z'
                    fill='url(#myGradient)'
                ></path>
            </svg>
            <div className='header-container'>
                <Image
                    className='cursor-pointer'
                    src={logo}
                    width={300}
                    height={300}
                    alt='Chatify Logo'
                    onClick={homeButton}
                />
                <h1 className='header-title'>Chatify</h1>
                {/* <button className='text-white p-2 hover:bg-whatsapp hover:text-black rounded transition duration-500 ease-in-out font-medium'>
                        Register
                    </button> */}
            </div>
            <div className='form-card'>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        signInWithEmailPassword();
                    }}
                >
                    <h1 className='header-t'>Log In</h1>
                    {error && (
                        <Alert variant='destructive'>
                            <AlertCircle className='h-4 w-4' />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <label htmlFor='email' className='label'>
                        Email
                    </label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='input'
                        placeholder='Enter your email'
                    />
                    <label htmlFor='password' className='label'>
                        Password
                    </label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input'
                        placeholder='Enter your password'
                    />
                    <p className='forgot-password-label'>
                        <a
                            onClick={forgotPassword}
                            className='forgot-password-button'
                        >
                            Forgot Password?
                        </a>
                    </p>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='button-submit'
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className='or-area'>
                    <div className='or-text'>OR</div>
                </div>
                <div className='flex mt-4 gap-x-2'>
                    <button
                        type='button'
                        onClick={signInWithGoogle}
                        className='button-google'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 32 32'
                            className='icon-google'
                        >
                            <path d='M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z'></path>
                        </svg>
                    </button>
                </div>

                <p className='no-acc-text'>
                    Do not have an account?{' '}
                    <a className='link-text' onClick={registerButton}>
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
