"use client";
import { useModal } from "@/contexts/ModalContext";
import { useEffect, useState } from "react";
import NewProduct from "@/app/products/new-product/page";
import ProductEditForm from "@/app/products/[id]/ProductEditForm";
import NewCustomer from "@/app/customers/new-customer/page";
import CustomerEditForm from "@/app/customers/[id]/CustomerEditForm";
import NewStockMovement from "@/app/stock-movement/new-stock-movement/page";
import StockMovementEditPage from "@/app/stock-movement/[id]/StockMovementEditPage";
import NewInvoice from "@/app/invoices/new-invoice/page";
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

  // useEffect(() => {
  //   if (modalType === "edit-invoice" && isOpen) {
  //     fetch("/api/products")
  //       .then((res) => res.json())
  //       .then((data) => setProducts(data))
  //       .catch((error) => console.error("Error fetching products:", error));
  //   }
  // }, [modalType, isOpen]);

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
      case "new-customer":
        return <NewCustomer isModal={true} onClose={closeModal} />;
      case "new-stock-movement":
        return <NewStockMovement isModal={true} onClose={closeModal} />;
      case "new-invoice":
        return <NewInvoice isModal={true} onClose={closeModal} />;
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
