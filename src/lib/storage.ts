/** 클라이언트에서만 쓰는 임시 id (목표 리스트 항목 등). 실제 데이터는 서버 DB의 id를 쓴다 */
export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
