import { Box, Center } from "@chakra-ui/react";
import { useLayoutEffect } from "react";
import { UrlShortenerForm } from "~/components/UrlShortenerForm";

export default function IndexPage() {
  // CSS hack to get the centered layout to work:
  useLayoutEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerText = `
      html, body, #__next {
        height: 100%;
        margin: 0;
      }
    `;
    document.head.appendChild(styleTag);
    return () => void document.removeChild(styleTag);
  }, []);

  return (
    <Box h="100%">
      <Center as="main" h="100%">
        <Box w="45rem">
          <UrlShortenerForm />
        </Box>
      </Center>
    </Box>
  );
}
