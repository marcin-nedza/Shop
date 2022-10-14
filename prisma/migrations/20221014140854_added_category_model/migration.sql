/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_fkey" FOREIGN KEY ("id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
