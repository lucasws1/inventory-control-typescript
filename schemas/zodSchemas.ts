import { Product } from "@/types/product";
import { z, ZodAny } from "zod";

export const StockReasonSchema = z.enum([
  "COMPRA",
  "VENDA",
  "AJUSTE_POSITIVO",
  "AJUSTE_NEGATIVO",
  "OUTRO",
]);

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  InvoiceItem: z.lazy((): z.ZodTypeAny => z.array(InvoiceItemSchema)),
  StockMovement: z.lazy((): z.ZodTypeAny => z.array(StockMovementSchema)),
});

export const InvoiceItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  productId: z.number(),
  Product: z.lazy((): z.ZodTypeAny => ProductSchema),
  invoiceId: z.number(),
  Invoice: z.lazy((): z.ZodTypeAny => InvoiceSchema),
});

export const CustomerUpdateSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(2, "Nome obrigatório!"),
  email: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || z.string().email().safeParse(val).success,
      "Email inválido!",
    ),
  phone: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

// export const CustomerSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   email: z.string(),
//   phone: z.string(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
//   Invoice: z.lazy((): z.ZodTypeAny => z.array(InvoiceSchema)),
// });

export const CustomerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório!"),
  email: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || z.string().email().safeParse(val).success,
      "Email inválido!",
    ),
  phone: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export const CreateInvoiceSchema = z.object({
  amount: z.number().min(0, "Valor deve ser maior que zero!"),
  pending: z.boolean().default(true),
  purchaseDate: z.coerce.date(),
  customerId: z.number().min(1, "Selecione um cliente!"),
  invoiceItems: z
    .array(
      z.object({
        productId: z.number().min(1, "Selecione um produto!"),
        quantity: z.number().min(1, "Quantidade deve ser maior que zero!"),
        unitPrice: z.number().min(0, "Preço unitário deve ser maior que zero!"),
      }),
    )
    .min(1, "Adicione pelo menos um item à fatura!"),
});

export const InvoiceSchema = z.object({
  id: z.number(),
  amount: z.number(),
  pending: z.boolean(),
  purchaseDate: z.coerce.date(),
  customerId: z.number(),
  customer: z.lazy((): z.ZodTypeAny => CustomerSchema),
  InvoiceItem: z.lazy((): z.ZodTypeAny => z.array(InvoiceItemSchema)),
});

export const UpdateCustomerSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome obrigatório!"),
  email: z.string().email("Email inválido!"),
  phone: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  Invoice: z.lazy(() => z.array(InvoiceSchema)),
});

export const UpdateInvoiceSchema = z.object({
  id: z.number(),
  amount: z.number(),
  pending: z.boolean(),
  purchaseDate: z.coerce.date(),
  customerId: z.number(),
  InvoiceItem: z.lazy(() => InvoiceItemSchema),
});

export const StockMovementUpdateSchema = z.object({
  id: z.number().min(1),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero!"),
  date: z.coerce.date(),
  reason: StockReasonSchema,
});

export const StockMovementSchema = z.object({
  id: z.number(),
  productId: z.number(),
  Product: z.lazy(() => ProductSchema),
  quantity: z.number(),
  date: z.coerce.date(),
  reason: StockReasonSchema,
});
