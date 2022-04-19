import { Box, Center, Heading } from "@chakra-ui/react";
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
          }
        `}</style>
      </Head>
      <Center as="main" h="100%" p={2}>
        <Box w="100%" maxW="55rem" h="20rem">
          <Heading textAlign="center" mb={4}>
            URL Shortener
          </Heading>
          <UrlShortenerForm />
        </Box>
      </Center>
    </Box>
  );
}
