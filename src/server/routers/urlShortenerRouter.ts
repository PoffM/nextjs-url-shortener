import { z } from "zod";
import { createRouter } from "../createRouter";

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
      z.string().nonempty("Required").url()
    ),
  }),
  resolve: ({ ctx, input }) =>
    ctx.urlShortenerService.shortenUrl(input.originalUrl),
});
