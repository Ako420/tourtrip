-- CreateEnum
CREATE TYPE "AttractionCategory" AS ENUM ('landmarks', 'nature', 'adventure', 'city');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "attractionId" TEXT,
ALTER COLUMN "hotelId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Attraction" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "category" "AttractionCategory" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "freeCancellation" BOOLEAN NOT NULL DEFAULT false,
    "sortRank" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "highlights" TEXT[],
    "address" TEXT NOT NULL,
    "reviewScores" JSONB NOT NULL,
    "policies" JSONB NOT NULL,
    "nearby" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketOption" (
    "id" TEXT NOT NULL,
    "attractionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "includes" TEXT[],
    "adultPrice" DECIMAL(10,2) NOT NULL,
    "childPrice" DECIMAL(10,2) NOT NULL,
    "dailyLimit" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attraction_slug_key" ON "Attraction"("slug");

-- CreateIndex
CREATE INDEX "Attraction_city_idx" ON "Attraction"("city");

-- CreateIndex
CREATE INDEX "Attraction_category_idx" ON "Attraction"("category");

-- CreateIndex
CREATE INDEX "Attraction_rating_idx" ON "Attraction"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "TicketOption_attractionId_name_key" ON "TicketOption"("attractionId", "name");

-- CreateIndex
CREATE INDEX "Review_attractionId_createdAt_idx" ON "Review"("attractionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "Attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketOption" ADD CONSTRAINT "TicketOption_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "Attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

