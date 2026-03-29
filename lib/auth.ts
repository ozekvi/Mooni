import NextAuth, { type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: string; discordId?: string } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    discordId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email guilds.join" } },
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
          const valid = await bcrypt.compare(credentials.password as string, user.password);
          if (!valid) return null;
          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            role: user.role,
          };
        } catch (e: any) {
          throw e;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord") {
        try {
          // Try to auto-join server if bot token is set
          if (process.env.DISCORD_BOT_TOKEN && account.access_token && profile?.id) {
            await fetch(
              `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${profile.id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ access_token: account.access_token }),
              }
            ).catch(() => {});
          }
        } catch {}
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
      }
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as any;
        token.discordId = discordProfile.id;
        // Check admin role
        if (process.env.DISCORD_BOT_TOKEN && discordProfile.id) {
          try {
            const res = await fetch(
              `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordProfile.id}`,
              { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
            );
            if (res.ok) {
              const member = await res.json();
              if (member.roles?.includes(process.env.DISCORD_ADMIN_ROLE_ID)) {
                token.role = "admin";
                await prisma.user.updateMany({
                  where: { id: user.id as string },
                  data: { role: "admin" },
                });
              }
            }
          } catch {}
        }
        await prisma.user.updateMany({
          where: { id: user.id as string },
          data: {
            discordId: discordProfile.id,
            emailVerified: new Date(),
          },
        }).catch(() => {});
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "user";
        session.user.discordId = token.discordId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user, account }) {
      if (account.provider === "discord") {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        }).catch(() => {});
      }
    },
  },
});
