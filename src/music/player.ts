import {
  AudioPlayer,
  createAudioPlayer,
  entersState,
  PlayerSubscription,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Track } from "./track";
import { createYoutubeAudioResource } from "./resource";
import { createReply } from "../util/replies";

export class Player {
  private player: AudioPlayer;
  private subscription: PlayerSubscription | undefined;

  constructor(private readonly connection: VoiceConnection) {
    this.player = createAudioPlayer();
    this.subscription = connection.subscribe(this.player);

    /** @reference https://discordjs.guide/voice/voice-connections.html#handling-disconnects */
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        connection.destroy();
      }
    });
  }

  public isOk() {
    return this.subscription !== undefined;
  }

  public stop() {
    this.player.stop();
  }

  public async play(track: Track) {
    try {
      const resource = await createYoutubeAudioResource(track.url);
      this.player.play(resource);
    } catch (error) {
      // this.sendMessage(
      //   createReply(`Error Playing ${track.title}`, { status: "warn" })
      // );
    }
  }
}
