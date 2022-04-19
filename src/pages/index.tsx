import { Box, Center } from "@chakra-ui/react";
import Head from "next/head";
import { UrlShortenerForm } from "~/components/UrlShortenerForm";

export default function IndexPage() {
  return (
    <Box h="100%">
      <Head>
        <style>{`
          /* Centered layout */
          html, body, #__next {
            height: 100%;
            margin: 0;
          }
        `}</style>
      </Head>
      <Center as="main" h="100%">
        <Box w="45rem">
          <UrlShortenerForm />
        </Box>
      </Center>
    </Box>
  );
}
