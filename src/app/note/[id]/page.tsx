"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, deleteNote } from "@/app/utils/firebase";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack,
  AccessTime,
} from "@mui/icons-material";
import {
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import DOMPurify from "dompurify";
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
const NotePage: FC = () => {
  const router = useRouter();
  const params = useParams();
  const noteId = params?.id as string;

  // Update the useState hook with the Note type
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const noteRef = doc(db, "users", userId, "notes", noteId);
        const noteSnap = await getDoc(noteRef);
        if (noteSnap.exists()) {
          const data = noteSnap.data();
          if (
            data &&
            data.title &&
            data.content &&
            data.createdAt &&
            data.updatedAt
          ) {
            setNote({
              id: noteSnap.id,
              title: data.title,
              content: data.content,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            });
          } else {
            console.error("Invalid note data:", data);
            setNote(null);
          }
        } else {
          setNote(null);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        setNote(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (noteId) fetchNote();
  }, [noteId]);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const handleDelete = async () => {
    try {
      await deleteNote(noteId);
      router.push("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!note) {
    return (
      <Box
        sx={{
          maxWidth: "md",
          mx: "auto",
          p: 4,
          textAlign: "center",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Note not found
        </Typography>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{
            color: "#5046e5", // Your brand color
            borderColor: "#5046e5", // Matching border
            "&:hover": {
              backgroundColor: "rgba(80, 70, 229, 0.08)", // Light hover effect
              borderColor: "#4038d0", // Slightly darker border on hover
            },
          }}
        >
          Back to all notes
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "md",
          mx: "auto",
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Header with Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBack />}
            sx={{
              textTransform: "none",
              color: "#5046e5", // Set text/icon color
              "&:hover": {
                backgroundColor: "#eee", // Optional: subtle hover effect
              },
            }}
          >
            All Notes
          </Button>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                textTransform: "none",
                px: 2,
                py: 1,
                bgcolor: "error.light",
                "&:hover": {
                  bgcolor: "error.main",
                  color: "white",
                },
              }}
            >
              Delete
            </Button>

            <Button
              component={Link}
              href={`/note/${note.id}/edit`}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                textTransform: "none",
                backgroundColor: "#5046e5",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#4039c9", // Slightly darker purple for hover
                },
              }}
            >
              Edit
            </Button>
          </Box>
        </Box>

        {/* Note Content */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            {note.title}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              whiteSpace: "normal", // Ensure regular whitespace behavior
              fontFamily: "inherit",
              lineHeight: 1.6,
              "& pre": {
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              },
            }}
          >
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.content),
              }}
              style={{
                whiteSpace: "normal", // Ensure normal white space behavior
              }}
            ></div>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <AccessTime fontSize="small" />
            <Typography variant="body2">
              Last updated: {formatDate(note.updatedAt || note.createdAt)}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Note?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. The note will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDialogOpen(false)}
            sx={{
              color: "#5046e5",
              "&:hover": {
                backgroundColor: "rgba(80, 70, 229, 0.08)", // subtle purple hover effect
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            // startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotePage;
