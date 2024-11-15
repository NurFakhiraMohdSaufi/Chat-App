// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCr8bjddBfLS4rwql1nwagBdQjSLRJaRek',
    authDomain: 'chat-app-98075.firebaseapp.com',
    projectId: 'chat-app-98075',
    storageBucket: 'chat-app-98075.appspot.com',
    messagingSenderId: '499094860549',
    appId: '1:499094860549:web:55abdf0b8dba92cdc1fd6c',
    measurementId: 'G-N7P795Q6BB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
