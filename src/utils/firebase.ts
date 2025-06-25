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
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
// export const saveNote = async (note: {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
// }) => {
//   if (!auth.currentUser) return;

//   const userId = auth.currentUser.uid;
//   const noteRef = doc(db, "users", userId, "notes", note.id); // 👈 use provided ID

//   await setDoc(noteRef, {
//     title: note.title,
//     content: note.content,
//     createdAt: note.createdAt,
//     updatedAt: note.updatedAt,
//   });
// };

export const saveNote = async (
  note: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  },
  folderId?: string
) => {
  if (!auth.currentUser) return;

  const userId = auth.currentUser.uid;

  const noteRef = folderId
    ? doc(db, "users", userId, "folders", folderId, "notes", note.id)
    : doc(db, "users", userId, "notes", note.id); // fallback to unsorted

  await setDoc(noteRef, {
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
};

// Get notes from Firestore
// export const getNotes = async () => {
//   if (!auth.currentUser) return [];

//   const userId = auth.currentUser.uid;
//   const notesRef = collection(db, "users", userId, "notes");
//   const q = query(notesRef, orderBy("createdAt", "desc"), limit(10)); // Get the 10 most recent notes
//   const querySnapshot = await getDocs(q);
//   const notes = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return notes;
// };

export const getNotes = async (folderId?: string) => {
  if (!auth.currentUser) return [];

  const userId = auth.currentUser.uid;
  const notesRef = folderId
    ? collection(db, "users", userId, "folders", folderId, "notes")
    : collection(db, "users", userId, "notes");

  const q = query(notesRef, orderBy("createdAt", "desc"), limit(10));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to delete a note
// export const deleteNote = async (noteId: string) => {
//   const user = auth.currentUser;
//   if (!user) throw new Error("User not authenticated.");

//   const noteRef = doc(db, "users", user.uid, "notes", noteId);
//   await deleteDoc(noteRef);
// };

export const deleteNote = async (noteId: string, folderId?: string) => {
  if (!auth.currentUser) throw new Error("User not authenticated.");

  const userId = auth.currentUser.uid;

  const noteRef = folderId
    ? doc(db, "users", userId, "folders", folderId, "notes", noteId)
    : doc(db, "users", userId, "notes", noteId);

  await deleteDoc(noteRef);
};

export const createFolder = async (userId: string, name: string, parentId: string | null = null) => {
  const foldersRef = collection(db, "users", userId, "folders");
  const docRef = await addDoc(foldersRef, {
    name,
    parentId: parentId || null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getFolders = async (userId: string) => {
  const foldersRef = collection(db, "users", userId, "folders");
  const snapshot = await getDocs(foldersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteFolder = async (userId: string, folderId: string) => {
  const folderRef = doc(db, "users", userId, "folders", folderId);
  await deleteDoc(folderRef);
};
