/*
  Warnings:

  - A unique constraint covering the columns `[email,userId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/

-- Create a default user if it doesn't exist
INSERT INTO "User" (id, name, email, "emailVerified", image)
VALUES ('default-user-id', 'Default User', 'default@example.com', null, null)
ON CONFLICT (id) DO NOTHING;

-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable - Add userId columns as optional first
ALTER TABLE "Customer" ADD COLUMN "userId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "userId" TEXT;
ALTER TABLE "Product" ADD COLUMN "userId" TEXT;
ALTER TABLE "StockMovement" ADD COLUMN "userId" TEXT;

-- Update all existing records to use the default user
UPDATE "Customer" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;
UPDATE "Invoice" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;
UPDATE "Product" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;
UPDATE "StockMovement" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE "Customer" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Invoice" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "StockMovement" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Customer_userId_idx" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_userId_key" ON "Customer"("email", "userId");

-- CreateIndex
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "StockMovement_userId_idx" ON "StockMovement"("userId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
