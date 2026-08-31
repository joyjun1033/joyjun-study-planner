/** 분 단위 값을 "2시간 15분" 같은 사람이 읽기 좋은 문자열로 바꾼다 */
export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0분";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}
