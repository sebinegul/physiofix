"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import BookConsultationModal from "./BookConsultationModal";

interface BookConsultationContextType {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}

const BookConsultationContext = createContext<BookConsultationContextType>({
  openModal: () => {},
  closeModal: () => {},
  isOpen: false,
});

export function useBookConsultation() {
  return useContext(BookConsultationContext);
}

export function BookConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <BookConsultationContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <BookConsultationModal isOpen={isOpen} onClose={closeModal} />
    </BookConsultationContext.Provider>
  );
}
