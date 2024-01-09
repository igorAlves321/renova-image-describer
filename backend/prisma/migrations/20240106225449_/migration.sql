/*
  Warnings:

  - Added the required column `title` to the `ImageDescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageDescription" ADD COLUMN     "title" TEXT NOT NULL;
