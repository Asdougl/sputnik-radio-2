import { nanoid } from "nanoid";
import { getInfo } from "ytdl-core";

type TrackOrigin = "youtube" | "spotify";

export type TrackMetadata = {
  title: string;
  artist: string;
  album: string;
  artwork_url: {
    url: string;
    height: number;
    width: number;
  };
  duration: number;
};

export type Enqueueable = {
  origin: TrackOrigin;
  url: string;
  channelId: string;
  queueBy: string;
  metadata?: TrackMetadata;
};

export class Track {
  public readonly id: string;

  constructor(
    public readonly url: string,
    public readonly metadata: TrackMetadata,
    public readonly origin: TrackOrigin,
    public readonly channelId: string,
    public readonly queuedBy: string
  ) {
    this.id = nanoid();
  }

  get title() {
    if (this.origin === "youtube") {
      return this.metadata.title;
    } else {
      return `${this.metadata.title} - ${this.metadata.artist}`;
    }
  }

  public getMetadata() {
    return {
      origin: this.origin,
      url: this.url,
      id: this.id,
      ...this.metadata,
    };
  }

  public static async from(enqueueable: Enqueueable): Promise<Track> {
    if (!enqueueable.metadata) {
      // Fetch metadata from the URL
      const info = await getInfo(enqueueable.url);
      return new Track(
        enqueueable.url,
        {
          title: info.videoDetails.title,
          artist: info.videoDetails.author.name,
          album: "",
          artwork_url: {
            url: info.videoDetails.thumbnails[0].url,
            height: info.videoDetails.thumbnails[0].height,
            width: info.videoDetails.thumbnails[0].width,
          },
          duration: parseInt(info.videoDetails.lengthSeconds),
        },
        enqueueable.origin,
        enqueueable.channelId,
        enqueueable.queueBy
      );
    } else {
      return new Track(
        enqueueable.url,
        enqueueable.metadata,
        enqueueable.origin,
        enqueueable.channelId,
        enqueueable.queueBy
      );
    }
  }
}
