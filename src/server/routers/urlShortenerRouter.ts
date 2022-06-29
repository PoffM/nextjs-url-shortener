import { z } from "zod";
import { createRouter } from "../createRouter";

/** Clean up a user-supplied URL. */
function prepareUrl(input: unknown) {
  if (typeof input === "string") {
    return (
      input
        // Trim whitespace:
        .trim()
        // Prepend "http://" if missing:
        .replace(/^(?=.)(?!https?:\/\/)/, "http://") || undefined
    );
  }
  return input;
}

/** URL shortener endpoints */
export const urlShortenerRouter = createRouter().mutation("shortenUrl", {
  input: z.object({
    originalUrl: z.preprocess(
      prepareUrl,
      z.string().nonempty("Required").max(2048).url()
    ),
  }),
  async resolve({ ctx, input }) {
    const url = new URL(input.originalUrl).toString();

    const { id, originalUrl } = await ctx.prisma.shortenedUrl.upsert({
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
      slug: ctx.hashids.encode(id),
    };
  },
});
