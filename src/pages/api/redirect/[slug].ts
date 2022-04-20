import { NumberLike } from "hashids/cjs/util";
import { NextApiHandler } from "next";
import { globalContext } from "~/server/context";

/**
 * Accepts the shortened url and redirects to the original URL.
 * When the shortened URL is invalid it redirects to a 404 page.
 */
const handler: NextApiHandler = async (req, res) => {
  const { hashids, prisma } = globalContext;

  const slug = req.url?.replace(/^\//, "") ?? "";

  let id: NumberLike | undefined;
  try {
    id = hashids.decode(slug)[0];
  } catch {
    // Leave id as undefined if the decoding fails e.g. invalid slug format.
  }

  const shortenedUrl =
    id !== undefined
      ? await prisma.shortenedUrl.findUnique({
          where: { id },
        })
      : null;

  res.redirect(301, shortenedUrl?.originalUrl ?? "/404");
};

export default handler;
