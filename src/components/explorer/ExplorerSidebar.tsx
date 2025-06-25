"use client";

import { useEffect, useState } from "react";
import { getFolders } from "@/utils/firebase"; // or from lib if you moved it
import { FolderTreeItem } from "./FolderTreeItem";
import { auth } from "@/utils/firebase";

type Folder = {
  id: string;
  name: string;
  parentId?: string | null;
};

export const ExplorerSidebar = () => {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getFolders(user.uid);
      setFolders(data as Folder[]);
    };

    fetchFolders();

    // Listen for custom event to refresh folders
    const handler = () => fetchFolders();
    window.addEventListener('folder-created', handler);
    return () => window.removeEventListener('folder-created', handler);
  }, []);

  // Render only root folders (parentId null or undefined) at the top level
  const rootFolders = folders.filter(f => !f.parentId);

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between px-2 mb-1">
        <h2 className="text-xs uppercase text-gray-500">Folders</h2>
        <button
          className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 sm:inline hidden"
          onClick={() => (window as any).triggerAddFolderMode && (window as any).triggerAddFolderMode()}
        >
          Add Folder
        </button>
      </div>
      {rootFolders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          allFolders={folders}
        />
      ))}
    </div>
  );
};
