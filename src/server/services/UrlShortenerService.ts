import { PrismaClient } from "@prisma/client";
import Hashids from "hashids/cjs";
import { NumberLike } from "hashids/cjs/util";
import { URL } from "url";

export class UrlShortenerService {
  private hashids = new Hashids("my-salt", 7);

  constructor(
    private shortenedUrlRepo: Pick<
      PrismaClient["shortenedUrl"],
      "upsert" | "findUnique"
    >
  ) {}

  public async shortenUrl(inputUrl: string) {
    const url = new URL(inputUrl).toString();

    const { id, originalUrl } = await this.shortenedUrlRepo.upsert({
      where: {
        originalUrl: url,
      },
      create: {
        originalUrl: url,
      },
      update: {},
    });

    return {
      originalUrl,
      slug: this.hashids.encode(id),
    };
  }

  public async unshortenUrl(slug: string) {
    let id: NumberLike | undefined;
    try {
      id = this.hashids.decode(slug)[0];
    } catch {
      // Return null if the decoding fails e.g. invalid slug format.
      return null;
    }

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
