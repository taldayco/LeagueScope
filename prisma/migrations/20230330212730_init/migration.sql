-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ipAddress_key" ON "User"("ipAddress");
