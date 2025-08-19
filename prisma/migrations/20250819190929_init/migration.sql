/*
  Warnings:

  - A unique constraint covering the columns `[freelancerId,projectId]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropIndex
DROP INDEX "public"."applications_freelancerId_idx";

-- DropIndex
DROP INDEX "public"."applications_projectId_freelancerId_key";

-- DropIndex
DROP INDEX "public"."applications_projectId_idx";

-- AlterTable
ALTER TABLE "public"."applications" ADD COLUMN     "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "bidAmount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "applications_freelancerId_projectId_key" ON "public"."applications"("freelancerId", "projectId");
