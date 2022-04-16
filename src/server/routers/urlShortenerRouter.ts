import { z } from "zod";
import { createRouter } from "../createRouter";

/** URL shortener endpoints */
export const urlShortenerRouter = createRouter().mutation("shortenUrl", {
  input: z.string(),
  resolve: ({ ctx, input }) => ctx.urlShortenerService.shortenUrl(input),
});
