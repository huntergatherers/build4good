/*
  Warnings:

  - The primary key for the `Listing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ListingTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ListingTag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PostComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PostComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PostImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PostImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `listing_id` on the `ListingComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `listing_id` on the `ListingImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `listing_id` on the `ListingTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `post_id` on the `PostComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `manual_post_id` on the `PostImage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `listing_id` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."ListingComment" DROP CONSTRAINT "ListingComment_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ListingImage" DROP CONSTRAINT "ListingImage_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ListingTag" DROP CONSTRAINT "ListingTag_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostComment" DROP CONSTRAINT "PostComment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostImage" DROP CONSTRAINT "PostImage_manual_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."profiles" DROP CONSTRAINT "profiles_id_fkey";

-- AlterTable
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Listing_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ListingComment" DROP COLUMN "listing_id",
ADD COLUMN     "listing_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ListingImage" DROP COLUMN "listing_id",
ADD COLUMN     "listing_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ListingTag" DROP CONSTRAINT "ListingTag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "listing_id",
ADD COLUMN     "listing_id" INTEGER NOT NULL,
ADD CONSTRAINT "ListingTag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PostComment" DROP CONSTRAINT "PostComment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "post_id",
ADD COLUMN     "post_id" INTEGER NOT NULL,
ADD CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PostImage" DROP CONSTRAINT "PostImage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "manual_post_id",
ADD COLUMN     "manual_post_id" INTEGER NOT NULL,
ADD CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_pkey",
ADD COLUMN     "approved_at" TIMESTAMP(3),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "listing_id",
ADD COLUMN     "listing_id" INTEGER NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."profiles";

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "header" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."PostImage" ADD CONSTRAINT "PostImage_manual_post_id_fkey" FOREIGN KEY ("manual_post_id") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostComment" ADD CONSTRAINT "PostComment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingImage" ADD CONSTRAINT "ListingImage_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingComment" ADD CONSTRAINT "ListingComment_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingTag" ADD CONSTRAINT "ListingTag_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
