-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN "matchedJobOpeningId" INTEGER;

-- CreateTable
CREATE TABLE "JobRole" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);
