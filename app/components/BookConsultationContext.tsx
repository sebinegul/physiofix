"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import BookConsultationModal from "./BookConsultationModal";
import LoginModal from "./LoginModal";

interface BookConsultationContextType {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  isLoginOpen: boolean;
}

const BookConsultationContext = createContext<BookConsultationContextType>({
  openModal: () => {},
  closeModal: () => {},
  isOpen: false,
  openLogin: () => {},
  closeLogin: () => {},
  isLoginOpen: false,
});

export function useBookConsultation() {
  return useContext(BookConsultationContext);
}

export function BookConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  return (
    <BookConsultationContext.Provider
      value={{ openModal, closeModal, isOpen, openLogin, closeLogin, isLoginOpen }}
    >
      {children}
      <BookConsultationModal
        isOpen={isOpen}
        onClose={closeModal}
        onOpenLogin={openLogin}
      />
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </BookConsultationContext.Provider>
  );
}
