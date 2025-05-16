import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL,
      uid: user.uid,
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

export { auth };
