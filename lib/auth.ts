import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user && user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // Após login bem-sucedido, redireciona para /
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/`;
    },
  },
  // debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "database",
  },
};

export async function auth() {
  return await getServerSession(authOptions);
}
