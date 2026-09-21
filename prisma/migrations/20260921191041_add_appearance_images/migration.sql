-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "aboutImage" TEXT NOT NULL DEFAULT '/images/about.jpg',
ADD COLUMN     "heroImage" TEXT NOT NULL DEFAULT '/images/hero.jpg',
ADD COLUMN     "promoBannerImage" TEXT NOT NULL DEFAULT '/images/promo-banner.jpg';
