"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, loginWithGoogle } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { Login as LoginIcon, ArrowForward, Subject } from "@mui/icons-material";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import LockIcon from "@mui/icons-material/Lock";
import DevicesIcon from "@mui/icons-material/Devices";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import SearchIcon from "@mui/icons-material/Search";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    await loginWithGoogle();
    router.push("/");
  };

  const features = [
    {
      icon: <CloudDoneIcon className="text-indigo-500" />,
      text: "Real-time cloud sync",
    },
    {
      icon: <LockIcon className="text-indigo-500" />,
      text: "End-to-end encryption",
    },
    {
      icon: <DevicesIcon className="text-indigo-500" />,
      text: "Cross-platform access",
    },
    {
      icon: <FormatColorTextIcon className="text-indigo-500" />,
      text: "Rich text formatting",
    },
    {
      icon: <SearchIcon className="text-indigo-500" />,
      text: "Powerful search",
    },
  ];

  return (
    <>
      <Head>
        <title>Scribe – Smart Notes, Simplified</title>
        <meta
          name="description"
          content="Scribe helps you capture, organize, and access your notes anywhere with cloud sync, rich formatting, and zero clutter."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5046e5" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-indigo-100 relative overflow-hidden pb-10">
        {/* Navbar */}
        <header className="flex justify-between items-center px-4 py-4 md:px-8 shadow-sm bg-white/60 backdrop-blur border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <Subject className="text-indigo-600 text-2xl drop-shadow" />
            <h1 className="text-xl font-bold text-indigo-600">Scribe</h1>
          </div>
          <button
            onClick={handleLogin}
            className="text-indigo-600 border border-indigo-600 rounded-full px-4 py-1.5 text-sm md:text-base hover:bg-indigo-50 font-semibold transition-all shadow-sm"
          >
            Sign In
          </button>
        </header>

        {/* Main Content */}
        <main className="mt-10 md:mt-20 px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Hero Section */}
          <section className="text-center md:text-left max-w-xl animate-fade-in order-1 md:order-none">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-800">
              Organize Your Thoughts with{" "}
              <span className="text-indigo-600">Scribe</span>
            </h2>
            <p className="text-gray-600 mt-4 text-base md:text-lg">
              The intuitive note-taking app that helps you capture ideas and
              remember what matters. Access your notes anywhere, anytime.
            </p>
            <div className="mt-6">
              <button
                onClick={handleLogin}
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full text-lg hover:bg-indigo-700 shadow-md transition-transform hover:scale-[1.02]"
              >
                Get Started
              </button>
              <p className="text-xs text-gray-500 mt-3 italic">
                Free forever. No ads. No hassle.
              </p>
            </div>
          </section>

          {/* Feature Card */}
          <section className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 space-y-5 border border-indigo-100 animate-slide-up order-2 md:order-none">
            <h3 className="text-xl font-semibold text-gray-800">
              Why Choose Scribe?
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-gray-800 text-base font-medium">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {/* Decorative Blobs */}
        <div className="hidden md:block absolute top-[-120px] right-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-100 blur-2xl z-[-1]" />
        <div className="hidden md:block absolute bottom-[-160px] left-[-140px] w-[500px] h-[500px] rounded-full bg-indigo-200 blur-3xl z-[-1]" />
      </div>
    </>
  );
}
