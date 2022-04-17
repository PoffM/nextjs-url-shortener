import Head from "next/head";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Nextjs URL Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
