"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

import Nav from "../components/Nav";
import Body from "../components/Body";
import SideBar from "../components/SideBar";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true); // User is logged in
      } else {
        setAuthenticated(false); // User is logged out
        router.push("/login"); // Redirect to login page if not authenticated
      }
      setLoading(false); // Stop loading once we have the auth status
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p>Loading...</p> {/* You can replace this with a spinner */}
      </div>
    );
  }

  // You can now use `authenticated` to conditionally render content
  if (!authenticated) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Render the page content when the user is authenticated
  return (
    <div className="flex">
      <SideBar />
      <div className="w-full">
        <Nav />
        <Body />
      </div>
    </div>
  );
}
