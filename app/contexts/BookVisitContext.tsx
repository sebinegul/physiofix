"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BookVisitContextType {
  isOpen: boolean;
  openBookVisit: () => void;
  closeBookVisit: () => void;
}

const BookVisitContext = createContext<BookVisitContextType>({
  isOpen: false,
  openBookVisit: () => {},
  closeBookVisit: () => {},
});

export function useBookVisit() {
  return useContext(BookVisitContext);
}

export function BookVisitProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBookVisit = useCallback(() => setIsOpen(true), []);
  const closeBookVisit = useCallback(() => setIsOpen(false), []);

  return (
    <BookVisitContext.Provider value={{ isOpen, openBookVisit, closeBookVisit }}>
      {children}
    </BookVisitContext.Provider>
  );
}
