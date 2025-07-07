"use client";

import dynamic from "next/dynamic";

const CustomersWithModal = dynamic(() => import("./CustomersWithModal"), {
  ssr: false,
});

export default function CustomersClient() {
  return <CustomersWithModal />;
}
