// contexts/ModalContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ModalType =
  | "new-product"
  | "edit-product"
  | "new-invoice"
  | "edit-invoice"
  | "new-customer"
  | "edit-customer"
  | "new-stock-movement"
  | "edit-stock-movement"
  | null;

interface ModalContextType {
  modalType: ModalType;
  modalData: any;
  isOpen: boolean;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalData, isOpen, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
