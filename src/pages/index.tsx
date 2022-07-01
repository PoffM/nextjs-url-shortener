import { Box, Center, Heading } from "@chakra-ui/react";
import { UrlShortenerForm } from "~/components/UrlShortenerForm";

export default function IndexPage() {
  return (
    <Box height="calc(100vh - env(safe-area-inset-bottom))">
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
