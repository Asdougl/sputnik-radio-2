import { Client, CommandInteraction } from "discord.js";
import { COMMAND, isCommand } from "../commands";
import {
  SputnikConnection,
  createConnection as createSputnikConnection,
} from "./connection";

type CommandCallback = (params: {
  interaction: CommandInteraction;
  connection: SputnikConnection;
}) => Promise<void>;

export class SputnikRadio {
  private connectionMap = new Map<string, SputnikConnection>();

  constructor(
    private client: Client,
    private createConnection: typeof createSputnikConnection,
    private events: Record<"play", CommandCallback>
  ) {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName, guildId } = interaction;

      if (!guildId) return;

      if (!isCommand(commandName)) {
        return interaction.reply("Unknown command");
      }

      if (commandName in events) {
        try {
          let connection = this.connectionMap.get(guildId);

          if (!connection) {
            connection = createConnection(interaction);
            this.connectionMap.set(guildId, connection);
          }

          events[commandName]({
            interaction,
            connection,
          });
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }
}
