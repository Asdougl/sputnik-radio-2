import { z } from "zod";

const schema = z.object({
  DISCORD_TOKEN: z.string(),
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),
});

export const env = schema.parse({
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
});
