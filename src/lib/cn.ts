/** 조건부 className 결합용 (clsx 의존성 없이 최소 구현) */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
