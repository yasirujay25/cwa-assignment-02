-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "stageIndex" INTEGER NOT NULL,
    "bgUrl" TEXT NOT NULL,
    "minutesInput" INTEGER NOT NULL,
    "timeLeft" INTEGER NOT NULL,
    "codes" JSONB NOT NULL DEFAULT '{}',
    "solved" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");
