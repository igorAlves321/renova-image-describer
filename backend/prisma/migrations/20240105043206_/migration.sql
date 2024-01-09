-- DropIndex
DROP INDEX "User_id_key";

-- CreateTable
CREATE TABLE "ImageDescription" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ImageDescription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageDescription" ADD CONSTRAINT "ImageDescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
