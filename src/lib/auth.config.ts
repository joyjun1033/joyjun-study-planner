import type { NextAuthConfig } from "next-auth";

/**
 * Edge(미들웨어)에서도 안전하게 import할 수 있는 설정만 모아둔 파일.
 * Prisma/bcrypt를 쓰는 Credentials provider의 authorize()는 여기 두지 않고
 * auth.ts에서 이 설정에 얹어서 확장한다.
 */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
