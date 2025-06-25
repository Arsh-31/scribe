"use client";

import { useState, useEffect, useRef } from "react";
import { getDocs, collection, orderBy, query } from "firebase/firestore";
import { db, auth, deleteFolder, createFolder } from "@/utils/firebase";
import { NoteItem } from "./NoteItem";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

type Folder = {
  id: string;
  name: string;
  parentId?: string | null;
};

type Props = {
  folder: Folder;
  allFolders: Folder[];
};

export const FolderTreeItem = ({ folder, allFolders }: Props) => {
  const { id: folderId, name } = folder;
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [hovered, setHovered] = useState(false);
  const [addSubfolderMode, setAddSubfolderMode] = useState(false);
  const [newSubfolderName, setNewSubfolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  const toggle = () => setExpanded(!expanded);

  useEffect(() => {
    const fetchNotes = async () => {
      const user = auth.currentUser;
      if (!user || !expanded) return;

      const notesRef = collection(
        db,
        "users",
        user.uid,
        "folders",
        folderId,
        "notes"
      );
      const q = query(notesRef, orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(q);
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchNotes();
  }, [expanded, folderId]);

  useEffect(() => {
    if (addSubfolderMode && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [addSubfolderMode]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete folder "${name}"? This cannot be undone.`)) return;
    const user = auth.currentUser;
    if (!user) return;
    await deleteFolder(user.uid, folderId);
    window.dispatchEvent(new Event("folder-created"));
    // If the deleted folder was selected, clear selection
    if ((window as any).selectedFolderId === folderId) {
      (window as any).selectedFolderId = null;
      try { localStorage.removeItem("selectedFolderId"); } catch {}
      window.dispatchEvent(new Event("folder-selected"));
    }
  };

  const handleAddSubfolder = async () => {
    const user = auth.currentUser;
    if (!user || !newSubfolderName.trim()) {
      setAddSubfolderMode(false);
      setNewSubfolderName("");
      return;
    }
    await createFolder(user.uid, newSubfolderName.trim(), folderId);
    setAddSubfolderMode(false);
    setNewSubfolderName("");
    window.dispatchEvent(new Event("folder-created"));
    setExpanded(true);
  };

  // Find subfolders
  const subfolders = allFolders.filter(f => f.parentId === folderId);

  return (
    <div className="mb-1">
      <div
        className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={toggle}
          className="text-xs text-gray-700 hover:bg-gray-200 px-1 py-1 rounded mr-1"
          tabIndex={-1}
        >
          {expanded ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
        </button>
        <span className="mr-2">📁</span>
        <span
          className="truncate flex-1 text-sm font-medium text-gray-700 hover:underline text-left"
          onClick={() => {
            (window as any).selectedFolderId = folderId;
            window.dispatchEvent(new Event('folder-selected'));
          }}
        >
          {name}
        </span>
        {/* Inline Add Folder and Add Note buttons */}
        {(hovered || isMobile) && (
          <>
            <button
              className="ml-1 text-gray-400 hover:text-purple-600 focus:outline-none"
              title="Add subfolder"
              onClick={e => { e.stopPropagation(); setAddSubfolderMode(true); setExpanded(true); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              className="ml-1 text-gray-400 hover:text-green-600 focus:outline-none"
              title="Add note (coming soon)"
              onClick={e => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              className="ml-2 text-gray-400 hover:text-red-600 focus:outline-none"
              title="Delete folder"
              onClick={handleDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.5 4.5A1.5 1.5 0 018 3h4a1.5 1.5 0 011.5 1.5V5H17a1 1 0 110 2h-1v9A2.5 2.5 0 0113.5 18h-7A2.5 2.5 0 014 16V7H3a1 1 0 110-2h2.5v-.5zM6 7v9a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V7H6zm2 2a1 1 0 112 0v5a1 1 0 11-2 0V9z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
      {addSubfolderMode && (
        <div className="pl-7 py-1">
          <input
            ref={inputRef}
            className="text-xs px-2 py-1 border border-gray-300 rounded w-40 focus:outline-none focus:border-purple-500"
            value={newSubfolderName}
            onChange={e => setNewSubfolderName(e.target.value)}
            onBlur={handleAddSubfolder}
            onKeyDown={e => { if (e.key === 'Enter') inputRef.current?.blur(); if (e.key === 'Escape') { setAddSubfolderMode(false); setNewSubfolderName(""); } }}
            placeholder="New subfolder name"
          />
        </div>
      )}
      {expanded && (
        <div className="pl-7 space-y-1 mt-1">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} folderId={folderId} />
          ))}
          {/* Render subfolders recursively */}
          {subfolders.map((sub) => (
            <FolderTreeItem key={sub.id} folder={sub} allFolders={allFolders} />
          ))}
        </div>
      )}
    </div>
  );
};
