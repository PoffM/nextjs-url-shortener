/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { env } from "./env";
import { UrlShortenerService } from "./services/UrlShortenerService";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}

const urlShortenerService = new UrlShortenerService(prisma.shortenedUrl);

export const globalContext = { prisma, urlShortenerService };

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function requestContext(
  opts: Partial<trpcNext.CreateNextContextOptions>
) {
  function redirect(status: number, url: string) {
    opts.res?.redirect(status, url);
  }

  return { ...globalContext, redirect };
}

export type RequestContext = trpc.inferAsyncReturnType<typeof requestContext>;
