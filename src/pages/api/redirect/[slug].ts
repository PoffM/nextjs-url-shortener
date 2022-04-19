import { NextApiHandler } from "next";
import { prisma } from "~/server/prisma";
import { UrlShortenerService } from "~/server/services/UrlShortenerService";

const urlShortenerService = new UrlShortenerService(prisma.shortenedUrl);

/**
 * Accepts the shortened url and redirects to the original URL.
 * When the shortened URL is invalid it redirects to a 404 page.
 */
const handler: NextApiHandler = async (req, res) => {
  const slug = req.url?.replace(/^\//, "") ?? "";
  const originalUrl = await urlShortenerService.unshortenUrl(slug);

  res.redirect(301, originalUrl ?? "/404");
};

export default handler;
