import { PrismaClient } from "@prisma/client";
import { getConnectionString } from "@netlify/database";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Netlify DB(Postgres)는 배포/브랜치별로 접속 문자열이 자동 결정되므로
 * getConnectionString()으로 런타임에 받아온다. Netlify 환경이 아니면(예: 순수 `next dev`)
 * DATABASE_URL 환경변수로 대체한다.
 */
function resolveDatabaseUrl(): string | undefined {
  try {
    const url = getConnectionString();
    if (url) return url;
  } catch {
    // Netlify DB 컨텍스트가 아니면 무시하고 아래에서 DATABASE_URL로 대체
  }
  return process.env.DATABASE_URL;
}

/** dev 모드 핫리로드 시 커넥션이 계속 새로 생기는 것을 막는 싱글턴 패턴 */
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
