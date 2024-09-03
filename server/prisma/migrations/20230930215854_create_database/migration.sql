-- CreateTable
CREATE TABLE "routines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "routine_week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routine_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    CONSTRAINT "routine_week_days_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "day_routines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "routine_id" TEXT NOT NULL,
    CONSTRAINT "day_routines_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_routines_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "routine_week_days_routine_id_week_day_key" ON "routine_week_days"("routine_id", "week_day");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "day_routines_day_id_routine_id_key" ON "day_routines"("day_id", "routine_id");
