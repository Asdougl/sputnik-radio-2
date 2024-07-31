import { getInfo, validateURL, videoInfo } from "ytdl-core";

type CachedInfo = {
  url: string;
  info: Promise<videoInfo>;
  cachedAt: number;
};

export class Youtube {
  static cache = new Map<string, CachedInfo>();

  static async getVideoInfo(url: string) {
    if (!validateURL(url)) {
      throw new Error("Invalid URL");
    }

    const cached = this.cache.get(url);

    if (cached && Date.now() - cached.cachedAt < 1000 * 60 * 60) {
      return cached.info;
    }

    const info = getInfo(url);

    this.cache.set(url, {
      url,
      info,
      cachedAt: Date.now(),
    });

    return info;
  }

  static async validateUrl(url: string) {
    return validateURL(url);
  }
}
