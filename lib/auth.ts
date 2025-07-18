import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });

          if (
            user &&
            user.password &&
            (await bcrypt.compare(
              credentials.password as string,
              user.password as string,
            ))
          ) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        } catch (error) {
          console.error("Erro na autenticação:", error);
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Para Google OAuth, usar o adapter do Prisma
      if (account?.provider === "google") {
        return true;
      }

      // Para credentials, apenas permitir se o usuário foi autenticado
      if (account?.provider === "credentials") {
        return !!user;
      }

      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }

      // Para Google OAuth, buscar o usuário no banco
      if (account?.provider === "google" && user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("Erro ao buscar usuário no banco:", error);
        }
      }

      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      // Após login bem-sucedido, redireciona para /
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/`;
    },
  },
  session: {
    strategy: "jwt",
  },
  // Configurações para produção
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} satisfies NextAuthConfig;

// Para Google OAuth, ainda precisamos do adapter
const authConfig = {
  ...config,
  adapter: PrismaAdapter(prisma),
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
