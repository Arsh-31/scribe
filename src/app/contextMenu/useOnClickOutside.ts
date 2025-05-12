import { useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
// This hook is used to detect clicks outside of a specified element.
// It takes a ref to the element and a handler function as arguments.
// The handler function is called when a click is detected outside of the element.
// The hook uses the useEffect hook to add event listeners for mousedown and touchstart events.
// It also cleans up the event listeners when the component is unmounted or when the ref or handler changes.
// The listener function checks if the click event target is not the ref's current element or any of its descendants.
// If the click is outside, it calls the handler function with the event.
// This is useful for implementing features like closing a dropdown or modal when clicking outside of it.
