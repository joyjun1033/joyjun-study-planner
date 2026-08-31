-- Netlify DB가 배포 시 자동으로 적용하는 초기 스키마.
-- prisma/schema.prisma의 모델과 1:1로 대응한다 (컬럼명은 Prisma 필드명 그대로, 대소문자 보존을 위해 큰따옴표 사용).

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

CREATE TABLE "Todo" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "date" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "done" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "Todo_userId_date_idx" ON "Todo" ("userId", "date");

CREATE TABLE "Goal" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "university" TEXT NOT NULL DEFAULT '',
  "weekTasks" JSONB NOT NULL DEFAULT '[]',
  "monthScoreTargets" JSONB NOT NULL DEFAULT '[]',
  "monthTasks" JSONB NOT NULL DEFAULT '[]',
  "year" TEXT NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX "Goal_userId_key" ON "Goal" ("userId");

CREATE TABLE "ExamEvent" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "date" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL
);
CREATE INDEX "ExamEvent_userId_date_idx" ON "ExamEvent" ("userId", "date");

CREATE TABLE "Grade" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "examName" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "scoreType" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "Grade_userId_idx" ON "Grade" ("userId");

CREATE TABLE "Habit" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);
CREATE INDEX "Habit_userId_idx" ON "Habit" ("userId");

CREATE TABLE "HabitCheck" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "habitId" TEXT NOT NULL REFERENCES "Habit" ("id") ON DELETE CASCADE,
  "date" TEXT NOT NULL,
  "checked" BOOLEAN NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "HabitCheck_habitId_date_key" ON "HabitCheck" ("habitId", "date");

CREATE TABLE "ScreenTimeEntry" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE,
  "date" TEXT NOT NULL,
  "minutes" INTEGER NOT NULL
);
CREATE UNIQUE INDEX "ScreenTimeEntry_userId_date_key" ON "ScreenTimeEntry" ("userId", "date");
