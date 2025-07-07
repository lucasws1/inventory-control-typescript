"use client";

import dynamic from "next/dynamic";

const CustomersWithModal = dynamic(() => import("./CustomersWithModal"), {
  ssr: false,
});

export default function CustomersClient({ customers }: { customers: any[] }) {
  return <CustomersWithModal customers={customers} />;
}
