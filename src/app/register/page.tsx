'use client';

import '@/styles/Auth.css';

import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	signInWithPopup,
	updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'universal-cookie';

import { auth, provider } from '@/config/firebase-config';

const cookies = new Cookies();

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const signUp = async () => {
        setIsSubmitting(true);
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const user = result.user;

            alert('Verification email sent. Please check your inbox');

            await updateProfile(user, {
                displayName: name,
            });

            await sendEmailVerification(user);

            // Check if the email is verified
            if (!user.emailVerified) {
                alert('Please verify your email before logging in.');
                router.push('/login');
                return;
            }

            cookies.set('auth-token', result.user.refreshToken);
            // setIsAuth(true);
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);

            setError('The email is already exist');
        } finally {
            setIsSubmitting(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await sendEmailVerification(user);

            // Check if the email is verified
            if (!user.emailVerified) {
                alert('Please verify your email before logging in.');
                return;
            }

            cookies.set('auth-token', user.refreshToken);
            alert('Verification email sent. Please check your inbox');
            // setIsAuth(true);
            router.push('/login');
        } catch (err) {
            console.error(err);
        }
    };

    const loginButton = () => {
        router.push('/login');
    };

    return (
        <div className='auth-container'>
            <div className='card-auth'>
                <h1 className='headerName'>Register</h1>
                {error && <p className='alert-warning'>{error}</p>}

                <form
                    className='mt-6'
                    onSubmit={(e) => {
                        e.preventDefault();
                        signUp();
                    }}
                >
                    <div className='mb-2'>
                        <label htmlFor='name' className='label'>
                            Name
                        </label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='input'
                            placeholder='Enter your name'
                        />
                    </div>
                    <div className='mb-2'>
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
                    </div>
                    <div className='mb-2'>
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
                    </div>
                    <div className='mt-6'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='button-submit'
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className='or-area'>
                    <div className='absolute px-5 bg-white'>Or</div>
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

                <p className='mt-8 text-xs font-light text-center text-gray-700'>
                    Already have an account?{' '}
                    <a
                        className='font-medium text-yellow-600 hover:underline'
                        onClick={loginButton}
                    >
                        Log In
                    </a>
                </p>
            </div>
        </div>
    );
}
