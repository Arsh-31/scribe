import { useRef } from "react";
import { useOnClickOutside } from "./useOnClickOutside";

interface MenuProps {
  x: number;
  y: number;
  closeContextMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ x, y, closeContextMenu }) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, closeContextMenu);

  return (
    <div
      ref={contextMenuRef}
      onClick={closeContextMenu}
      className="absolute bg-gray-100 border border-gray-300 rounded shadow-lg z-50 w-38"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <div
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
        onClick={closeContextMenu}
      >
        Copy
        <span className="animate-pulse"> 📋</span>
      </div>
      <hr className="mx-2 text-gray-300" />
      <div
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
        onClick={closeContextMenu}
      >
        Reload
        <span className="animate-pulse"> 🔄</span>
      </div>
      <hr className="mx-2 text-gray-300" />
      <div
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
        onClick={closeContextMenu}
      >
        Save
        <span className="animate-pulse"> 💾</span>
      </div>{" "}
    </div>
  );
};

export default Menu;
