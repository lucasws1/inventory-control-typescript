"use client";
import { useModal } from "@/contexts/ModalContext";
import NewProductModal from "@/components/modals/NewProductModal";
import ProductEditForm from "@/components/forms/ProductEditForm";
import NewCustomerModal from "@/components/modals/NewCustomerModal";
import CustomerEditForm from "@/components/forms/CustomerEditForm";
import NewStockMovementModal from "@/components/modals/NewStockMovementModal";
import StockMovementEditForm from "@/components/forms/StockMovementEditForm";
import NewInvoiceModal from "@/components/modals/NewInvoiceModal";
import InvoiceEditForm from "@/components/forms/InvoiceEditForm";
import { useData } from "@/contexts/DataContext";
import { ProductWithRelations } from "@/types/ProductWithRelations";

export default function GlobalModalManager() {
  const { modalType, modalData, isOpen, closeModal } = useModal();
  const { products } = useData();

  if (!isOpen) return null;

  const renderModal = () => {
    switch (modalType) {
      case "new-product":
        return <NewProductModal isModal={true} onClose={closeModal} />;
      case "edit-product":
        return (
          <ProductEditForm
            product={modalData}
            isModal={true}
            onClose={closeModal}
          />
        );
      case "new-customer":
        return <NewCustomerModal isModal={true} onClose={closeModal} />;
      case "new-stock-movement":
        return <NewStockMovementModal isModal={true} onClose={closeModal} />;
      case "new-invoice":
        return <NewInvoiceModal isModal={true} onClose={closeModal} />;
      case "edit-invoice":
        return (
          <InvoiceEditForm
            invoice={modalData}
            products={products as ProductWithRelations[]}
            isModal={true}
            onClose={closeModal}
          />
        );
      case "edit-customer":
        return (
          <CustomerEditForm
            customer={modalData}
            isModal={true}
            onClose={closeModal}
          />
        );
      case "edit-stock-movement":
        return (
          <StockMovementEditForm
            stockMovement={modalData}
            isModal={true}
            onClose={closeModal}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
}
