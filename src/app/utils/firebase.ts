// lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

// Google login function
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User logged in:", user);
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Auth state change listener
export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => {
  onAuthStateChanged(auth, callback);
};

// Save note to Firestore
export const saveNote = async (note: {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}) => {
  if (!auth.currentUser) return;

  const userId = auth.currentUser.uid;
  const noteRef = doc(db, "users", userId, "notes", note.id); // 👈 use provided ID

  await setDoc(noteRef, {
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
};

// Get notes from Firestore
export const getNotes = async () => {
  if (!auth.currentUser) return [];

  const userId = auth.currentUser.uid;
  const notesRef = collection(db, "users", userId, "notes");
  const q = query(notesRef, orderBy("createdAt", "desc"), limit(10)); // Get the 10 most recent notes
  const querySnapshot = await getDocs(q);
  const notes = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return notes;
};

// Function to delete a note
export const deleteNote = async (noteId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated.");

  const noteRef = doc(db, "users", user.uid, "notes", noteId);
  await deleteDoc(noteRef);
};
