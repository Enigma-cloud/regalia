import * as firebase from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBjqT-ARGMDHHPkCc95wcOaQpiUAdt6GGQ",
    authDomain: "crwn-clothing-dtb.firebaseapp.com",
    projectId: "crwn-clothing-dtb",
    storageBucket: "crwn-clothing-dtb.appspot.com",
    messagingSenderId: "760930125490",
    appId: "1:760930125490:web:6d2444aa7471c91168ebab",
    measurementId: "G-YNKXYV1LE5"
};

const KEY_PREFIX = 'regalia';

// Firestore function
export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) {
        return;
    }

    const currentUserId = `${userAuth.uid}`;
    const userRef = doc(firestoreDB, `${KEY_PREFIX}-users`, currentUserId);

    const snapShot = await getDoc(userRef);

    if (!snapShot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userRef, {
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.log('Error occured while creating new users: ', error);
        }
    }
    
    return userRef;
}

firebase.initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestoreDB = getFirestore();

// Google Auth utility
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
// Google Sign In (Account)
export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then(userCredentials => console.log(`User ${userCredentials} has signed in with their Google account!`))
};

export default firebase;