import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBksx035tZuBcfEbT2qQu0sa6pb2CbFqi4',
    authDomain: 'our-321602.firebaseapp.com',
    projectId: 'our-321602',
    storageBucket: 'our-321602.appspot.com',
    messagingSenderId: '434134559890',
    appId: '1:434134559890:web:71ffacf4f820123a75ca4b',
    measurementId: 'G-JEW7B63B43'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                name: user.displayName,
                authProvider: 'google',
                email: user.email
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

export { auth, signInWithGoogle, logout };
