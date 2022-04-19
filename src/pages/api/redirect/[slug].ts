import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/prisma";
import { UrlShortenerService } from "~/server/services/UrlShortenerService";

const urlShortenerService = new UrlShortenerService(prisma.shortenedUrl);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.url?.replace(/^\//, "") ?? "";
  const originalUrl = await urlShortenerService.unshortenUrl(slug);

  res.redirect(301, originalUrl ?? "/404");
};

export default handler;
