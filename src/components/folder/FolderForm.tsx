"use client";

import { useState } from "react";
import { createFolder } from "../../utils/firebase";
import { auth } from "@/utils/firebase";

export const FolderForm = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    await createFolder(user.uid, name.trim());
    setName("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New folder name"
        className="px-4 py-2 border rounded-md w-full"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
};
