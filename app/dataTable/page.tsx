"use client";
import { DataTable } from "./data-table";

export default function DataTableClient({
  columns,
  data,
}: {
  columns: any;
  data: any;
}) {
  return <DataTable columns={columns} data={data} />;
}
