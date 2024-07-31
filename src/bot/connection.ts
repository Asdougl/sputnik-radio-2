import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Player } from "../music/player";
import { Queue } from "../music/queue";
import { CommandInteraction } from "discord.js";

export const createConnection = (
  interaction: CommandInteraction
): SputnikConnection => {
  if (
    !interaction?.member ||
    !("voice" in interaction.member) ||
    !interaction.member.voice.channel ||
    !interaction.guildId ||
    !interaction.guild
  ) {
    throw new Error("You must be in a voice channel to use this command");
  }

  const connection = joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  const player = new Player(connection);

  return new SputnikConnection(
    interaction.member.voice.channel.id,
    connection,
    new Queue(interaction.guildId, player),
    player
  );
};

export class SputnikConnection {
  constructor(
    public readonly channelId: string,
    public readonly voiceConnection: VoiceConnection,
    public readonly queue: Queue,
    public readonly player: Player
  ) {}
}
