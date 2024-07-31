import { Player } from "./player";
import { Track } from "./track";

const queues = new Map<string, Queue>();

export class Queue {
  private tracks: Track[];

  constructor(public readonly guildId: string, public readonly player: Player) {
    this.tracks = [];
    queues.set(guildId, this);
  }

  public destroy() {
    queues.delete(this.guildId);
  }
}
