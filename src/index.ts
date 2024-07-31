import {
  ApplicationCommandOptionType,
  Client,
  GatewayIntentBits,
} from "discord.js";
import dotenv from "dotenv";
import { COMMAND } from "./commands";
import { SputnikRadio } from "./bot";
import { entersState, VoiceConnectionStatus } from "@discordjs/voice";
import { createConnection } from "./bot/connection";
import { createReply } from "./util/replies";
import { getEnqueuable } from "./services";

dotenv.config();

console.log("Initialising Sputnik Radio...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", () =>
  console.log(
    `Sputnik Radio is Online as [${client.user ? client.user.tag : "unknown"}]`
  )
);

const LAUNCH_COMMAND = "!launch-sputnik!";

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (
    message.content.toLowerCase() === LAUNCH_COMMAND &&
    message?.member?.permissions.has("Administrator")
  ) {
    console.log("Launching Sputnik Radio...");

    try {
      await message.guild.commands.set([
        {
          name: COMMAND.PLAY,
          description: "Plays a song",
          options: [
            {
              name: "song",
              type: ApplicationCommandOptionType.String,
              description: "The URL of the song to play",
              required: true,
            },
          ],
        },
        {
          name: COMMAND.SKIP,
          description: "Skip to the next song in the queue",
        },
        {
          name: COMMAND.QUEUE,
          description: "See the music queue",
        },
        {
          name: COMMAND.CLEAR,
          description: "Clear the music queue",
        },
      ]);

      await message.reply("Commands Deployed!");
    } catch (error) {
      console.warn(error);
      await message.reply("Error Deploying Commands! Please try again later");
    }
  }
});

const sputnikRadio = new SputnikRadio(client, createConnection, {
  [COMMAND.PLAY]: async ({ interaction, connection }) => {
    const queue = connection.queue;

    await interaction.deferReply();

    const songQuery = interaction.options.get("song")?.value as string;

    try {
      await entersState(
        connection.voiceConnection,
        VoiceConnectionStatus.Ready,
        20e3
      );
    } catch (error) {
      console.warn(error);
      await interaction.followUp(
        createReply(
          "Failed to join voice channel within 20 seconds, please try again later!",
          { status: "warn" }
        )
      );
      return;
    }

    const enqueueable = getEnqueuable(
      songQuery,
      interaction.channelId,
      interaction
    ); // huh?
  },
});
