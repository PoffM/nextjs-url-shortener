import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { PropsWithChildren, ReactElement, useMemo } from "react";
import { DefaultLayout } from "~/components/DefaultLayout";
import { AppRouter } from "~/server/routers/appRouter";
import { SSRContext } from "~/utils/trpc";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement<unknown> | null;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function UrlShortenerApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return <AppWrapper>{getLayout(<Component {...pageProps} />)}</AppWrapper>;
}

/** Wrapper with all context providers. */
export function AppWrapper({ children }: PropsWithChildren<unknown>) {
  const theme = useMemo(
    () => extendTheme({ config: { initialColorMode: "dark" } }),
    []
  );

  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${
      process.env.PORT ?? ""
    }`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;

    if (ctx.status) {
      // If HTTP status set, propagate that
      return {
        status: ctx.status,
      };
    }

    const error = opts.clientErrors[0];
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }
    // For app caching with SSR see https://trpc.io/docs/caching
    return {};
  },
})(UrlShortenerApp);
