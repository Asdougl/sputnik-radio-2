import { CommandInteraction } from "discord.js";
import { Enqueueable, Track } from "../music/track";
import { Youtube } from "./youtube";

export const getEnqueuable = async (
  query: string,
  channelId: string,
  interaction: CommandInteraction
): Promise<Enqueueable | null> => {
  if (/youtube.com|youtu\.be/.test(query)) {
    // youtube link

    const info = await Youtube.getVideoInfo(query);

    return {
      url: query,
      channelId,
      origin: "youtube",
      queueBy: interaction.user.id,
    };
  } else {
    return null;
  }
};
