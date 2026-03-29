import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { inviteToDiscordServer, getDiscordUserRoles } from "@/lib/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) return null;
          if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            role: user.role,
            discordId: user.discordId ?? undefined,
          };
        } catch (error) {
          if (error instanceof Error && error.message === "EMAIL_NOT_VERIFIED") {
            throw new Error("EMAIL_NOT_VERIFIED");
          }
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "discord") {
        try {
          // Auto-invite to Discord server
          if (account.access_token && user.id) {
            await inviteToDiscordServer(account.access_token, user.id);
          }
          // Mark email as verified for Discord users
          if (user.id) {
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: new Date() },
            });
          }
        } catch (error) {
          console.error("Discord signIn callback error:", error);
          // Don't block sign in if Discord invite fails
        }
      }
      return true;
    },
    async session({ session, user, token }) {
      if (session.user) {
        const userId = user?.id || token?.sub || "";
        session.user.id = userId;

        if (userId) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: userId },
              select: { role: true, discordId: true },
            });

            if (dbUser) {
              if (dbUser.discordId) {
                try {
                  const isAdmin = await getDiscordUserRoles(dbUser.discordId);
                  session.user.role = isAdmin ? "admin" : dbUser.role;
                } catch {
                  session.user.role = dbUser.role;
                }
              } else {
                session.user.role = dbUser.role;
              }
              session.user.discordId = dbUser.discordId ?? undefined;
            }
          } catch (error) {
            console.error("Session callback error:", error);
            session.user.role = "user";
          }
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      if (account?.provider === "discord" && account.providerAccountId) {
        token.discordId = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
  events: {
    async linkAccount({ user, account }) {
      if (account.provider === "discord") {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              discordId: account.providerAccountId,
              emailVerified: new Date(),
            },
          });
        } catch (error) {
          console.error("linkAccount event error:", error);
        }
      }
    },
  },
  // Trust the host header for Vercel deployments
  trustHost: true,
});
