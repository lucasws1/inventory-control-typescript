import { Invoice } from "./invoice";

export type Customer = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  Invoice?: Invoice[];
};
