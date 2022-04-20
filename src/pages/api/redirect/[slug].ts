import { NextApiHandler } from "next";
import { globalContext } from "~/server/context";

/**
 * Accepts the shortened url and redirects to the original URL.
 * When the shortened URL is invalid it redirects to a 404 page.
 */
const handler: NextApiHandler = async (req, res) => {
  const slug = req.url?.replace(/^\//, "") ?? "";
  const originalUrl = await globalContext.urlShortenerService.unshortenUrl(
    slug
  );

  res.redirect(301, originalUrl ?? "/404");
};

export default handler;
