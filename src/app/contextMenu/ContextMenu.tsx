"use client";

import { MouseEvent, useState } from "react";
import Menu from "./Menu";
import Nav from "../components/Nav";
import Body from "../components/Body";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

export default function ContextMenu() {
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const handleContextMenu = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const { pageX, pageY } = e;

    setContextMenu({
      show: true,
      x: pageX,
      y: pageY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(initialContextMenu);
  };

  return (
    <div onContextMenu={(e) => handleContextMenu(e)}>
      {contextMenu.show && (
        <Menu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={closeContextMenu}
        />
      )}
      <Nav />
      <Body />
    </div>
  );
}
