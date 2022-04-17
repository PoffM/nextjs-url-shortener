import { z } from "zod";
import { createRouter } from "../createRouter";

function trimString(input: unknown) {
  return typeof input === "string" ? input.trim() : input;
}

/** URL shortener endpoints */
export const urlShortenerRouter = createRouter().mutation("shortenUrl", {
  input: z.object({
    originalUrl: z.preprocess(trimString, z.string().min(1, "Required")),
  }),
  resolve: ({ ctx, input }) =>
    ctx.urlShortenerService.shortenUrl(input.originalUrl),
});
