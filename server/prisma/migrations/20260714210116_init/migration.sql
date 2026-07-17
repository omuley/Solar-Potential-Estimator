-- CreateTable
CREATE TABLE "SolarApiCache" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "monthlyBill" DOUBLE PRECISION NOT NULL,
    "monthlyEnergy" DOUBLE PRECISION NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolarApiCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolarApiCache_latitude_longitude_monthlyBill_monthlyEnergy_key" ON "SolarApiCache"("latitude", "longitude", "monthlyBill", "monthlyEnergy");
