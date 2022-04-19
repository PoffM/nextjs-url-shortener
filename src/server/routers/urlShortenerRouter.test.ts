import { createContextInner } from "../context";
import { appRouter } from "./appRouter";

describe("URL shortener router", () => {
  it("Shorten URL", async () => {
    const ctx = await createContextInner({});
    const caller = appRouter.createCaller(ctx);

    const shortenedUrl = await caller.mutation("shortenUrl", {
      originalUrl: "youtube.com",
    });

    expect(shortenedUrl).toEqual({
      originalUrl: "youtube.com",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      slug: expect.stringMatching(/^.{7}$/),
    });
  });
});
