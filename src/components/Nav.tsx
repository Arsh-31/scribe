"use client";

import { FC, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useSearch } from "../app/contextMenu/SearchContext";
import {
  Search as SearchIcon,
  AccountCircle,
  ExitToApp,
  ArrowDropDown,
} from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useIsMobile } from "../hooks/useIsMobile"; // adjust path

const Nav: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { query, setQuery } = useSearch();
  const open = Boolean(anchorEl);

  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleMenuClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  console.log("User Photo URL:", user?.photoURL);
  if (isMobile) {
    return (
      <nav className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2 px-4 sm:px-6 bg-white border-b border-gray-200 shadow-sm">
        {/* User Profile */}
        <div className="flex items-center justify-end w-full sm:w-auto mt-2">
          {user ? (
            <>
              <div
                className="flex items-center cursor-pointer"
                onClick={handleMenuOpen}
              >
                <Avatar
                  src={user.photoURL || "/assets/default.jpg"}
                  alt={user.displayName || "User"}
                  className="w-8 h-8"
                >
                  {!user.photoURL && (
                    <AccountCircle className="text-gray-400" />
                  )}
                </Avatar>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.displayName || "User"}
                </span>
                <ArrowDropDown className="text-gray-500 hidden sm:inline" />
              </div>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleLogout}>
                  <ExitToApp fontSize="small" className="mr-2 text-gray-500" />
                  <span className="text-gray-700">Logout</span>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className="text-sm text-gray-500">Not signed in</div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full sm:w-80 pl-10 pr-4 py-2 mb-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 transition duration-200 focus:outline-none focus:ring-1 focus:ring-[#5046e5] focus:border-[#5046e5]"
            />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full flex justify-between items-center py-2 px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 transition duration-200 focus:outline-none focus:ring-1 focus:ring-[#5046e5] focus:border-[#5046e5]"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center">
        {user ? (
          <>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleMenuOpen}
            >
              <Avatar
                src={user.photoURL || "/assets/default.jpg"}
                alt={user.displayName || "User"}
                className="w-8 h-8"
              >
                {!user.photoURL && <AccountCircle className="text-gray-400" />}
              </Avatar>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {user.displayName || "User"}
              </span>
              <ArrowDropDown className="text-gray-500" />
            </div>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogout}>
                <ExitToApp fontSize="small" className="mr-2 text-gray-500" />
                <span className="text-gray-700">Logout</span>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <div className="text-sm text-gray-500">Not signed in</div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
