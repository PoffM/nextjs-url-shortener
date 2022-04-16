-- CreateTable
CREATE TABLE "ShortenedUrl" (
    "id" BIGSERIAL NOT NULL,
    "originalUrl" TEXT NOT NULL,

    CONSTRAINT "ShortenedUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortenedUrl_originalUrl_key" ON "ShortenedUrl"("originalUrl");
