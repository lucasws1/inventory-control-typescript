/*
  Warnings:

  - Added the required column `userId` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable - Add userId column as optional first
ALTER TABLE "InvoiceItem" ADD COLUMN "userId" TEXT;

-- Update all existing InvoiceItem records with userId from their related Invoice
UPDATE "InvoiceItem" 
SET "userId" = "Invoice"."userId" 
FROM "Invoice" 
WHERE "InvoiceItem"."invoiceId" = "Invoice"."id" 
AND "InvoiceItem"."userId" IS NULL;

-- Now make the column NOT NULL
ALTER TABLE "InvoiceItem" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "InvoiceItem_userId_idx" ON "InvoiceItem"("userId");

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
