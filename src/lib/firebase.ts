import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDI0vcor-lw65N7W_bTf3liipE9xMCEZGg',
  authDomain: 'les-arsani.firebaseapp.com',
  projectId: 'les-arsani',
  storageBucket: 'les-arsani.firebasestorage.app',
  messagingSenderId: '161128315884',
  appId: '1:161128315884:web:7effcb8e7fc53e8f2edec9',
  measurementId: 'G-8HHBKWCQZH',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
