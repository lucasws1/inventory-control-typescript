"use client";
import { useModal } from "@/contexts/ModalContext";
import { useEffect, useState } from "react";
import NewProductModal from "@/components/modals/NewProductModal";
import ProductEditForm from "@/app/products/[id]/ProductEditForm";
import NewCustomerModal from "@/components/modals/NewCustomerModal";
import CustomerEditForm from "@/app/customers/[id]/CustomerEditForm";
import NewStockMovementModal from "@/components/modals/NewStockMovementModal";
import StockMovementEditPage from "@/app/stock-movement/[id]/StockMovementEditPage";
import NewInvoiceModal from "@/components/modals/NewInvoiceModal";
import InvoiceEditForm from "@/app/invoices/[id]/InvoiceEditForm";
import { Product } from "@/types/product";
import axios from "axios";

export default function GlobalModalManager() {
  const { modalType, modalData, isOpen, closeModal } = useModal();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (modalType === "edit-invoice" && isOpen) {
      const fetchProducts = async () => {
        try {
          const { data: productsData } = await axios.get("/api/products");
          setProducts(productsData);
        } catch (error) {
          console.log("Error fetching products:", error);
        }
      };
      fetchProducts();
    }
  }, [modalType, isOpen]);

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
            products={products}
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
          <StockMovementEditPage
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
