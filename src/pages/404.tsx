import { Box, Center, Heading } from "@chakra-ui/react";
import Head from "next/head";

export default function Custom404() {
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
        <Heading>404 - Page Not Found</Heading>
      </Center>
    </Box>
  );
}
