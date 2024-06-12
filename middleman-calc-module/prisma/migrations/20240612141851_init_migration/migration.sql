-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suppliers" JSONB NOT NULL,
    "consumers" JSONB NOT NULL,
    "supply" JSONB NOT NULL,
    "demand" JSONB NOT NULL,
    "purchaseCosts" JSONB NOT NULL,
    "sellingCosts" JSONB NOT NULL,
    "transportationCosts" JSONB NOT NULL,
    "allocationTable" JSONB NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "intermediaryProfit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);
