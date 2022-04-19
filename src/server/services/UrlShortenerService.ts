import { PrismaClient } from "@prisma/client";
import Hashids from "hashids/cjs";
import Url from "url-parse";

export class UrlShortenerService {
  private hashids = new Hashids("my-salt", 7);

  constructor(
    private shortenedUrlRepo: Pick<
      PrismaClient["shortenedUrl"],
      "upsert" | "findUnique"
    >
  ) {}

  public async shortenUrl(originalUrl: string) {
    const url = new Url(originalUrl);

    // Use https if there is no protocol:
    if (!url.protocol) {
      url.set("protocol", "https:");
      url.set("slashes", true);
    }

    const formattedUrl = url.toString().replace(/^https\/\/:@/, "https://");

    const shortenedUrl = await this.shortenedUrlRepo.upsert({
      where: {
        originalUrl: formattedUrl,
      },
      create: {
        originalUrl: formattedUrl,
      },
      update: {},
    });

    return {
      originalUrl,
      slug: this.hashids.encode(shortenedUrl.id),
    };
  }

  public async unshortenUrl(slug: string) {
    const id = this.hashids.decode(slug)[0];

    if (id === undefined) {
      return null;
    }

    const url = await this.shortenedUrlRepo.findUnique({
      where: { id },
    });

    if (!url) {
      throw new Error(`No url found for slug ${slug}`);
    }

    return url.originalUrl;
  }
}
