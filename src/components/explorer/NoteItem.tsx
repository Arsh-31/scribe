import Link from "next/link";
import { Article } from "@mui/icons-material";

type Props = {
  note: { id: string; title?: string };
  folderId: string;
};

export const NoteItem = ({ note, folderId }: Props) => {
  return (
    <Link
      href={`/note/${note.id}?folder=${folderId}`}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-100"
    >
      <Article fontSize="small" className="text-gray-400" />
      {note.title || "Untitled"}
    </Link>
  );
};
