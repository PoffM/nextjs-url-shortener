import { createContextInner } from "../context";
import { appRouter } from "./_app";

describe("URL shortener router", () => {
  it("Shorten URL", async () => {
    const ctx = await createContextInner({});
    const caller = appRouter.createCaller(ctx);

    const shortenedUrl = await caller.mutation("shortenUrl", "youtube.com");

    expect(shortenedUrl).toEqual({
      originalUrl: "youtube.com",
      slug: "Dox4Qbr",
    });
  });
});
