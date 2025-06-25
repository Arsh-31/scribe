"use client";

import { FC, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { saveNote } from "../../utils/firebase";
import RichTextEditor from "../../components/RichTextEditor";
import { ArrowBack, HelpOutline, Save, Close } from "@mui/icons-material";

const Page: FC = () => {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlFolderId = searchParams.get("folder");

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    const now = new Date().toISOString();

    try {
      const folderId =
        urlFolderId ||
        (typeof window !== "undefined"
          ? (window as any).selectedFolderId
          : undefined);

      await saveNote(
        {
          id: uuidv4(),
          title: title.trim() || "Untitled",
          content,
          createdAt: now,
          updatedAt: now,
        },
        folderId
      );
      router.push("/");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  }, [content, title, router, urlFolderId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "b":
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
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center px-4 py-6">
      {/* Toolbar */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-[#5046e5] hover:underline flex items-center gap-1"
          >
            <ArrowBack fontSize="small" />
            <span className="text-sm">Back</span>
          </button>
          <span className="text-xs text-green-600 border border-green-300 px-2 py-0.5 rounded-full">
            Auto-saved
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="text-[#5046e5] border border-[#5046e5] hover:bg-[#f0efff] text-sm px-4 py-1.5 rounded"
          >
            <HelpOutline className="inline-block mr-1" fontSize="small" />
            Help
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className={`text-sm px-6 py-2 rounded text-white ${
              isSaving || !content.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#5046e5] hover:bg-[#3f3bbd]"
            }`}
          >
            <Save className="inline-block mr-1" fontSize="small" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Document Page */}
      <section className="bg-white w-full max-w-[794px] shadow-md rounded-xl px-10 py-8 mb-16">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={(e) => e.target.select()}
          placeholder="Title your note..."
          className="w-full text-3xl font-semibold mb-6 border-none focus:outline-none bg-transparent"
        />
        <RichTextEditor value={content} onChange={setContent} />
      </section>

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Markdown Help</h2>
              <button onClick={() => setShowHelp(false)}>
                <Close />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-medium">Headings</h3>
                <p className="text-sm text-gray-600">
                  <kbd>#</kbd> H1, <kbd>##</kbd> H2, <kbd>###</kbd> H3
                </p>
              </div>
              <hr />
              <div>
                <h3 className="font-medium">Formatting</h3>
                <p className="text-sm text-gray-600">
                  <kbd>Ctrl+B</kbd> Bold, <kbd>Ctrl+I</kbd> Italic
                </p>
              </div>
            </div>
            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={() => setShowHelp(false)}
                className="bg-[#5046e5] text-white px-4 py-2 rounded hover:bg-[#3f3bbd]"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
