import { compare, hash } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { credentialsSchema } from "@/lib/auth/credentials";
import { isDevelopmentLoginEnabled } from "@/lib/auth/dev-login";
import {
  clearLoginFailures,
  isLoginBlocked,
  recordLoginFailure,
} from "@/lib/auth/login-throttle";
import { prisma } from "@/lib/prisma";

const dummyPasswordHash = hash("not-a-real-account-password", 12);
let developmentPasswordHash: Promise<string> | undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        if (isDevelopmentLoginEnabled()) {
          const developmentUsername = process.env.DEV_ADMIN_USERNAME;
          const developmentPassword = process.env.DEV_ADMIN_PASSWORD;
          if (!developmentUsername || !developmentPassword) {
            throw new Error(
              "DEV_ADMIN_USERNAME and DEV_ADMIN_PASSWORD are required when development login is enabled.",
            );
          }

          if (
            parsed.data.username.toLowerCase() !==
            developmentUsername.trim().toLowerCase()
          ) {
            return null;
          }

          if (!developmentPasswordHash) {
            developmentPasswordHash = hash(developmentPassword, 12);
          }
          const passwordMatches = await compare(
            parsed.data.password,
            await developmentPasswordHash,
          );
          if (!passwordMatches) {
            return null;
          }

          return {
            id: "local-development-admin",
            name: developmentUsername,
            email: null,
            isAdmin: true,
          };
        }

        const login = parsed.data.username.toLowerCase();
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: login }, { email: login }],
          },
        });
        const throttleIdentity = user?.username ?? "unknown-administrator";

        if (await isLoginBlocked(throttleIdentity)) {
          return null;
        }

        const passwordHash = user?.passwordHash ?? (await dummyPasswordHash);
        const passwordMatches = await compare(parsed.data.password, passwordHash);

        if (!user || !user.isAdmin || !passwordMatches) {
          await recordLoginFailure(throttleIdentity);
          return null;
        }

        await clearLoginFailures(throttleIdentity);

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.isAdmin = user.isAdmin;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          typeof token.userId === "string" ? token.userId : "";
        session.user.isAdmin = token.isAdmin === true;
      }

      return session;
    },
  },
});
