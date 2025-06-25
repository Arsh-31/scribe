"use client";

import { useEffect, useState } from "react";
import { getFolders } from "@/lib/firebase/folder";
import { FolderItem } from "./FolderItem";
import { useAuth } from "@/hooks/useAuth"; // same custom hook

type Folder = {
  id: string;
  name: string;
};

export const FolderList = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchFolders = async () => {
      const data = await getFolders(user.uid);
      setFolders(data as Folder[]);
    };
    fetchFolders();
  }, [user]);

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <FolderItem key={folder.id} name={folder.name} />
      ))}
    </div>
  );
};
