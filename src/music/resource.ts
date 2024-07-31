import { createAudioResource, demuxProbe } from "@discordjs/voice";
import { downloadFromInfo, getInfo } from "ytdl-core";

export const createYoutubeAudioResource = async (url: string) => {
  const info = await getInfo(url);

  const stream = downloadFromInfo(info, {
    filter: "audioonly",
    quality: "highestaudio",
  });

  const probe = await demuxProbe(stream);

  return createAudioResource<(typeof info)["videoDetails"]>(probe.stream, {
    metadata: info.videoDetails,
    inputType: probe.type,
  });
};
