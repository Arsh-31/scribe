"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const SearchContext = createContext<{
  query: string;
  setQuery: (q: string) => void;
}>({
  query: "",
  setQuery: () => {},
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
