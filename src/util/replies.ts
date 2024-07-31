import { BaseMessageOptions, EmbedBuilder } from "discord.js";

type ReplyType = "log" | "warn" | "error";

const COLOR = {
  PRIMARY: "#fbc812",
  WARNING: "#cd0001",
  ERROR: "#580000",
} as const;
type COLOR = (typeof COLOR)[keyof typeof COLOR];

export type ReplyOptions = {
  footer?: string;
  status?: ReplyType;
  image_url?: string;
};

export const createReply = (
  baseText: string,
  options?: ReplyOptions
): BaseMessageOptions => {
  const embed = new EmbedBuilder().setDescription(baseText);

  if (options?.footer) {
    embed.setFooter({ text: options.footer });
  }

  if (options?.image_url) {
    embed.setThumbnail(options.image_url);
  }

  if (options?.status && options.status !== "log") {
    if (options.status === "warn") {
      embed.setColor(COLOR.WARNING);
    } else {
      embed.setColor(COLOR.PRIMARY);
    }
  } else {
    embed.setColor(COLOR.PRIMARY);
  }

  return {
    embeds: [embed],
  };
};
