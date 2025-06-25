// utils/firestoreNotes.ts
import { db } from "./firebase"; // Adjust the import path as necessary
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export const addNote = async (
  uid: string,
  note: { title: string; content: string }
) => {
  const notesRef = collection(db, "notes");
  await addDoc(notesRef, {
    ...note,
    uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUserNotes = async (uid: string) => {
  const notesRef = collection(db, "notes");
  const q = query(notesRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
