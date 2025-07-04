// components/GlobalModalManager.tsx
"use client";
import { useModal } from "@/contexts/ModalContext";
import NewProduct from "@/app/products/new-product/page";
import ProductEditForm from "@/app/products/[id]/ProductEditForm";

export default function GlobalModalManager() {
  const { modalType, modalData, isOpen, closeModal } = useModal();

  if (!isOpen) return null;

  const renderModal = () => {
    switch (modalType) {
      case "new-product":
        return <NewProduct isModal={true} onClose={closeModal} />;
      case "edit-product":
        return (
          <ProductEditForm
            product={modalData}
            isModal={true}
            onClose={closeModal}
          />
        );
      // Adicione outros modais aqui
      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
}
