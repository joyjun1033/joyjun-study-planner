-- ExamEvent에 종류(category)와 표시 색(color) 컬럼 추가.
-- 일정 칸을 시험 전용에서 범용 일정으로 확장하면서, 활동 종류별로 다른 색 점을 달력에 표시하기 위함.

ALTER TABLE "ExamEvent" ADD COLUMN "category" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ExamEvent" ADD COLUMN "color" TEXT NOT NULL DEFAULT '#94A3B8';
