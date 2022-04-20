import { requestContext } from "../context";
import { appRouter } from "./appRouter";

describe("URL shortener router", () => {
  const ctx = requestContext({});
  const caller = appRouter.createCaller(ctx);

  it("Shortens a URL.", async () => {
    const shortenedUrl = await caller.mutation("shortenUrl", {
      originalUrl: "https://google.ca",
    });

    expect(shortenedUrl).toEqual({
      originalUrl: "https://google.ca/",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      slug: expect.stringMatching(/^.{7}$/),
    });
  });

  it("Shortens a URL and auto-prefixes the protocol.", async () => {
    const shortenedUrl = await caller.mutation("shortenUrl", {
      originalUrl: "youtube.com",
    });

    expect(shortenedUrl).toEqual({
      originalUrl: "http://youtube.com/",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      slug: expect.stringMatching(/^.{7}$/),
    });
  });

  it("Throws an error on a bad URL.", async () => {
    await expect(() =>
      caller.mutation("shortenUrl", { originalUrl: "bad:url" })
    ).rejects.toThrowError("Invalid url");
  });

  it("Throws an error on a blank URL.", async () => {
    await expect(() =>
      caller.mutation("shortenUrl", { originalUrl: "" })
    ).rejects.toThrowError("Required");
  });
});
