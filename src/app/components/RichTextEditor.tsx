"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaHighlighter,
  FaSubscript,
  FaSuperscript,
  FaListOl,
  FaListUl,
  FaCode,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

interface Props {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 border border-gray-300 rounded-md min-h-[300px] max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-md bg-gray-50">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold (Ctrl+B)"
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic (Ctrl+I)"
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
          title="Underline (Ctrl+U)"
        >
          <FaUnderline />
        </button>

        {/* Links */}
        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
          title="Link"
        >
          <FaLink />
        </button>

        {/* Headings */}

        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("paragraph") ? "bg-gray-200 font-bold" : ""
          }`}
          title="Paragraph"
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 font-bold"
              : ""
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 font-bold"
              : ""
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 font-bold"
              : ""
          }`}
          title="Heading 3"
        >
          H3
        </button>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
          title="Align Right"
        >
          <FaAlignRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
          }`}
          title="Align Justify"
        >
          <FaAlignJustify />
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
        >
          <FaListUl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Ordered List"
        >
          <FaListOl />
        </button>

        {/* Code */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("codeBlock") ? "bg-gray-200" : ""
          }`}
          title="Code Block"
        >
          <FaCode className="text-lg" />
        </button>

        {/* Blockquote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="Blockquote"
        >
          <FaQuoteLeft />
        </button>

        {/* Highlight */}
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("highlight") ? "bg-gray-200" : ""
          }`}
          title="Highlight"
        >
          <FaHighlighter />
        </button>

        {/* Subscript/Superscript */}
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("subscript") ? "bg-gray-200" : ""
          }`}
          title="Subscript"
        >
          <FaSubscript />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("superscript") ? "bg-gray-200" : ""
          }`}
          title="Superscript"
        >
          <FaSuperscript />
        </button>

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Undo"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Redo"
        >
          <FaRedo />
        </button>
      </div>

      {/* Bubble Menu (appears when selecting text) */}
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("bold") ? "bg-gray-200" : ""
              }`}
            >
              <FaBold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("italic") ? "bg-gray-200" : ""
              }`}
            >
              <FaItalic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("underline") ? "bg-gray-200" : ""
              }`}
            >
              <FaUnderline />
            </button>
            <button
              onClick={addLink}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor.isActive("link") ? "bg-gray-200" : ""
              }`}
            >
              <FaLink />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>

      {/* Add these styles to your global CSS */}
    </div>
  );
};

export default RichTextEditor;
