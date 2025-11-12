
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged,User } from "firebase/auth";
import { get } from "http";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "yt-clone-a3014.firebaseapp.com",
  projectId: "yt-clone-a3014",
  appId: "1:750649912895:web:5dda01e3cfefba6aecd28a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void){
    return onAuthStateChanged(auth, callback);
};
