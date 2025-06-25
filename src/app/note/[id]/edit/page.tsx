"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Button, TextField, Box, Container, Typography } from "@mui/material";
import RichTextEditor from "@/components/RichTextEditor";

const EditNotePage = () => {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.id as string;

  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId || !noteId) return;

        const noteRef = doc(db, "users", userId, "notes", noteId);
        const noteSnap = await getDoc(noteRef);
        if (noteSnap.exists()) {
          const data = noteSnap.data();
          setTitle(data.title);
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error loading note:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleUpdate = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    setIsSaving(true);
    try {
      const noteRef = doc(db, "users", userId, "notes", noteId);
      await updateDoc(noteRef, {
        title: title.trim() || "Untitled",
        content,
        updatedAt: new Date().toISOString(),
      });
      // router.push(`/note/${noteId}`);
      router.push("/");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update note.");
    } finally {
      setIsSaving(false);
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
        <Typography>Loading note...</Typography>
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/note/${noteId}`)}
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "#5046e5",
              borderColor: "#5046e5",
              "&:hover": {
                borderColor: "#5046e5",
                backgroundColor: "rgba(80, 70, 229, 0.08)", // optional hover bg
              },
            }}
          >
            Back to Note
          </Button>

          <Button
            onClick={handleUpdate}
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={isSaving}
            sx={{
              textTransform: "none",
              px: 3,
              backgroundColor: "#5046e5",
              "&:hover": {
                backgroundColor: "#3d3bb3", // a darker shade for hover effect
              },
            }}
          >
            {isSaving ? "Saving..." : "Update Note"}
          </Button>
        </Box>

        {/* Title */}
        <TextField
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          InputProps={{
            sx: {
              fontSize: "2rem",
              fontWeight: "bold",
              py: 1,
              "&:before, &:after": { borderBottom: "none" },
            },
          }}
          sx={{ mb: 3 }}
        />

        {/* Content */}
        {/* <TextField
          fullWidth
          multiline
          minRows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          variant="outlined"
          InputProps={{
            sx: {
              lineHeight: 1.6,
              fontFamily: "inherit",
              "& textarea": {
                whiteSpace: "pre-wrap",
              },
            },
          }}
        /> */}
        <RichTextEditor value={content} onChange={setContent} />
      </Container>
    </Box>
  );
};

export default EditNotePage;
