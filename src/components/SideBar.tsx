"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { app, auth } from "../utils/firebase";
import {
  Dashboard as DashboardIcon,
  NoteAdd as NoteAddIcon,
  Article as ArticleIcon,
  ChevronRight,
  // Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Drawer,
  IconButton,
  Divider,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { ExplorerSidebar } from "./explorer/ExplorerSidebar";

// Define the Note type
interface Note {
  id: string;
  title?: string; // Optional, as it can be undefined
  updatedAt: Date;
}

const SideBar: FC = () => {
  // Update the useState hook with the Note type
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const db = getFirestore(app);
        const notesRef = collection(db, "users", currentUser.uid, "notes");
        const notesQuery = query(
          notesRef,
          orderBy("updatedAt", "desc"),
          limit(6)
        );
        const notesSnapshot = await getDocs(notesQuery);

        const notesList = notesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date(0),
        }));

        setRecentNotes(notesList);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const drawerContent = (
    <Box
      sx={{
        width: 260,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
      }}
    >
      {/* Logo */}
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Scribe
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Navigation */}
      <nav className="space-y-1 mb-6 mt-2">
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <DashboardIcon className="mr-3 text-gray-500" />
          Dashboard
        </Link>
        <Link
          href="/newnote"
          className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <NoteAddIcon className="mr-3 text-gray-500" />
          New Note
        </Link>
        <Link
          href="/newfolder"
          className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <NoteAddIcon className="mr-3 text-gray-500" />
          New Note
        </Link>
      </nav>

      {/* Recent Notes */}
      {/* <Box sx={{ flexGrow: 1, mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ px: 2, mb: 1, display: "block", color: "gray" }}
        >
          Recent Notes
        </Typography>
        <Box className="space-y-1">
          {recentNotes.length > 0 ? (
            recentNotes.map((note) => (
              <Link
                key={note.id}
                href={`/note/${note.id}`}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center truncate">
                  <ArticleIcon
                    className="mr-3 text-gray-400"
                    fontSize="small"
                  />
                  <span className="truncate">{note.title || "Untitled"}</span>
                </div>
                <ChevronRight className="text-gray-400" fontSize="small" />
              </Link>
            ))
          ) : (
            <p className="px-3 text-sm text-gray-500">No recent notes</p>
          )}
        </Box>
      </Box> */}

      {/* Folder Explorer */}
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <ExplorerSidebar />
      </Box>

      {/* <Divider sx={{ mb: 2 }} />
      <Link
        href="/settings"
        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        <SettingsIcon className="mr-3 text-gray-500" />
        Settings
      </Link> */}
    </Box>
  );

  return (
    <>
      {/* Toggle button for mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1100 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideBar;
