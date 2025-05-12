import { FC, JSX, useEffect, useState } from "react";
import Link from "next/link";
import { deleteNote, getNotes } from "../utils/firebase";
import { relativeTime } from "../utils/dateFormat";
import DOMPurify from "dompurify";

import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Delete, Add, Search, ArrowForward } from "@mui/icons-material";
import { useSearch } from "../contextMenu/SearchContext";

// Define the Note type
interface Note {
  id: string;
  title?: string; // Optional, as it can be undefined
  content: string;
  updatedAt: Date;
}

const Body: FC = ({}) => {
  // Update the useState hook with the Note type
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const { query } = useSearch();

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await getNotes();
      const formattedNotes = fetchedNotes.map(
        (note: {
          id: string;
          title?: string;
          content?: string;
          updatedAt?: string;
        }) => ({
          id: note.id,
          title: note.title || "Untitled",
          content: note.content || "",
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date(),
        })
      );
      setNotes(formattedNotes);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    try {
      await deleteNote(noteToDelete);
      setIsDialogOpen(false);
      setNoteToDelete(null);
      setNotes(notes.filter((note) => note.id !== noteToDelete));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
  );

  function highlightMatch(text: string, query: string): JSX.Element | string {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-blue-100 text-blue-800 rounded px-1">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="text-center text-gray-500">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
            <p className="text-gray-500">{filteredNotes.length} notes</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/newnote">
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  backgroundColor: "#4f46e5",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#4338ca",
                  },
                }}
              >
                New Note
              </Button>
            </Link>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="relative group transition-all duration-200 hover:-translate-y-1"
              >
                <Link href={`/note/${note.id}`} className="block h-full">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-100 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {highlightMatch(note.title || "Untitled", query)}
                      </h2>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          setNoteToDelete(note.id);
                          setIsDialogOpen(true);
                        }}
                        size="small"
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                        sx={{
                          color: "gray.600",
                          "&:hover": { color: "red.500" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                    {/* <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {highlightMatch(note.content.slice(0, 200), query) ||
                        "No content..."}
                    </p> */}
                    <div
                      className="prose prose-sm max-w-none text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap h-6"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(note.content),
                      }}
                    ></div>

                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {note.updatedAt
                          ? relativeTime(note.updatedAt)
                          : "No date"}
                      </span>
                      <div className="flex items-center text-[#5046e5] text-sm font-medium">
                        View <ArrowForward fontSize="small" sx={{ ml: 0.5 }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <Search sx={{ fontSize: 48 }} />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {query ? "No matching notes" : "No notes yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {query
                    ? "Try a different search term"
                    : "Create your first note to get started"}
                </p>
                <Link href="/newnote">
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      backgroundColor: "#4f46e5",
                      color: "white",
                      fontWeight: "500",
                      borderRadius: "8px",
                      padding: "8px 20px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#4338ca",
                      },
                    }}
                  >
                    Create New Note
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "16px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "gray.800", p: 2 }}>
          Delete Note?
        </DialogTitle>
        <DialogContent sx={{ p: 2, color: "gray.600" }}>
          This action cannot be undone. The note will be permanently deleted.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsDialogOpen(false)}
            sx={{
              color: "#5046e5", // Updated to your brand color
              fontWeight: 500,
              textTransform: "none",
              // border: "1px solid #5046e5", // Optional: Add border for better visibility
              "&:hover": {
                backgroundColor: "rgba(80, 70, 229, 0.08)", // Light hover effect
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: "#ef4444",
              color: "white",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Body;
