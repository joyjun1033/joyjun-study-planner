/** 클라이언트 타입은 createdAt을 number(epoch ms)로 기대하므로 Prisma의 Date를 변환한다 */
export function withEpoch<T extends { createdAt: Date }>(item: T): Omit<T, "createdAt"> & { createdAt: number } {
  return { ...item, createdAt: item.createdAt.getTime() };
}
