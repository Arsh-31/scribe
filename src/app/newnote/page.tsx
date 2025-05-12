"use client";

import { FC, useState, useEffect, useCallback } from "react"; // Updated import
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { saveNote } from "../utils/firebase";

import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  TextField,
  Paper,
  Divider,
  Typography,
} from "@mui/material";
import { ArrowBack, HelpOutline, Save, Close } from "@mui/icons-material";
import RichTextEditor from "../components/RichTextEditor";

const Page: FC = () => {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    const now = new Date().toISOString();

    try {
      await saveNote({
        id: uuidv4(),
        title: title.trim() || "Untitled",
        content,
        createdAt: now,
        updatedAt: now,
      });
      router.push("/");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  }, [content, title, router]); // Add dependencies here

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "b":
            e.preventDefault();
            break;
          case "i":
            e.preventDefault();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, handleSave]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* App Bar */}
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => router.push("/")}
              sx={{ color: "#5046e5" }}
            >
              <ArrowBack />
            </IconButton>
            <Chip
              label="Auto-saved"
              size="small"
              color="success"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={() => setShowHelp(true)}
              startIcon={<HelpOutline />}
              variant="outlined"
              sx={{
                color: "#5046e5",
                borderColor: "#5046e5",
                "&:hover": {
                  borderColor: "#403ac6",
                  backgroundColor: "#f0efff",
                },
              }}
            >
              Help
            </Button>

            <Button
              onClick={handleSave}
              startIcon={<Save />}
              disabled={isSaving || !content.trim()}
              variant="contained"
              sx={{
                minWidth: 100,
                backgroundColor: "#5046e5",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3f3bbd",
                },
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Editor Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
          padding: 3,
          gap: 3,
        }}
      >
        {/* Title */}
        <TextField
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={(e) => e.target.select()}
          placeholder="Note title..."
          InputProps={{
            sx: {
              fontSize: "2rem",
              fontWeight: "bold",
              "&:before, &:after": { borderBottom: "none" },
            },
          }}
        />

        {/* Content Editor */}
        <RichTextEditor value={content} onChange={setContent} />
      </Box>

      {/* Help Dialog */}
      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Markdown Help</Typography>
          <IconButton onClick={() => setShowHelp(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="Headings"
                secondary={
                  <>
                    <kbd>#</kbd> H1, <kbd>##</kbd> H2, <kbd>###</kbd> H3
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Formatting"
                secondary={
                  <>
                    <kbd>Ctrl+B</kbd> Bold, <kbd>Ctrl+I</kbd> Italic
                  </>
                }
              />
            </ListItem>
          </List>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => setShowHelp(false)}
            color="primary"
            variant="contained"
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Page;
