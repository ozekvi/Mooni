import NextAuth, { type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
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
  // No adapter — pure JWT mode, compatible with both Credentials + Discord
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
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
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // On sign-in, persist user data into token
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
      }

      // Discord OAuth — sync user to DB
      if (account?.provider === "discord" && profile) {
        const discordProfile = profile as any;
        const discordId = discordProfile.id as string;
        const discordEmail = discordProfile.email as string | undefined;
        const discordName = (discordProfile.username || discordProfile.global_name) as string;
        const discordAvatar = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.png`
          : undefined;

        // Upsert user in DB
        let dbUser = await prisma.user.findFirst({
          where: { OR: [{ discordId }, ...(discordEmail ? [{ email: discordEmail }] : [])] },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              discordId,
              email: discordEmail,
              name: discordName,
              image: discordAvatar,
              emailVerified: new Date(),
              role: "user",
            },
          });
        } else {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { discordId, image: discordAvatar, emailVerified: new Date() },
          });
        }

        token.id = dbUser.id;
        token.discordId = discordId;
        token.picture = discordAvatar;
        token.name = discordName;

        // Check admin role via bot
        if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
          try {
            const res = await fetch(
              `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`,
              { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
            );
            if (res.ok) {
              const member = await res.json();
              const isAdmin = member.roles?.includes(process.env.DISCORD_ADMIN_ROLE_ID);
              token.role = isAdmin ? "admin" : dbUser.role;
              if (isAdmin) {
                await prisma.user.update({ where: { id: dbUser.id }, data: { role: "admin" } });
              }
              // Auto-invite to server
              if (account.access_token) {
                await fetch(
                  `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`,
                  {
                    method: "PUT",
                    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token: account.access_token }),
                  }
                ).catch(() => {});
              }
            }
          } catch {}
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "user";
        session.user.discordId = token.discordId as string | undefined;
        if (token.picture) session.user.image = token.picture as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
});
