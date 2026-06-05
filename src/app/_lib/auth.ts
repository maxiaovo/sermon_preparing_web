import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { loginSchema } from "@/app/_lib/schemas";
import { prisma } from "@/app/_lib/prisma";
import { verifyTeamchatUser, getTeamchatUser } from "@/app/_lib/teamchat-db";

function syntheticEmail(username: string) {
  return `${username}@liao.xiaogushi.us`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const teamchatUser = await verifyTeamchatUser(username, password);
        if (!teamchatUser) return null;

        const email = syntheticEmail(teamchatUser.username);
        const name = teamchatUser.nickname ?? teamchatUser.username;
        const id = String(teamchatUser.id);

        // Upsert shadow user in Prisma for FK relationships
        await prisma.user.upsert({
          where: { email },
          update: { name, id },
          create: { id, email, name },
        });

        return { id, email, name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
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
});
