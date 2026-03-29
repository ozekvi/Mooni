const DISCORD_API = "https://discord.com/api/v10";
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID!;

export async function inviteToDiscordServer(
  userAccessToken: string,
  userId: string
): Promise<boolean> {
  try {
    // Get user's Discord ID first
    const userRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    });
    if (!userRes.ok) return false;
    const discordUser = await userRes.json();

    // Add user to guild using bot
    const res = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/members/${discordUser.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: userAccessToken }),
    });

    return res.status === 201 || res.status === 204;
  } catch {
    console.error("Failed to invite user to Discord server");
    return false;
  }
}

export async function getDiscordUserRoles(discordUserId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${DISCORD_API}/guilds/${GUILD_ID}/members/${discordUserId}`,
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      }
    );

    if (!res.ok) return false;
    const member = await res.json();
    return member.roles?.includes(ADMIN_ROLE_ID) || false;
  } catch {
    return false;
  }
}

export async function getDiscordUser(userId: string) {
  try {
    const res = await fetch(`${DISCORD_API}/users/${userId}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
