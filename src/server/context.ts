/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import Hashids from "hashids/cjs";
import { env } from "./env";

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

const hashids = new Hashids("my-salt", 7);

export const globalContext = { prisma, hashids };

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function requestContext(
  _opts: Partial<trpcNext.CreateNextContextOptions>
) {
  return { ...globalContext };
}

export type RequestContext = trpc.inferAsyncReturnType<typeof requestContext>;
