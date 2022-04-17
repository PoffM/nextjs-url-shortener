import { Box, Flex, Link, List, ListItem } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { inferMutationOutput, trpc } from "~/utils/trpc";
import { MutationForm, OnSuccess } from "./forms/MutationForm";
import { SubmitButton } from "./forms/SubmitButton";
import { TextField } from "./forms/TextField";

export function UrlShortenerForm() {
  const shortenUrl = trpc.useMutation("shortenUrl");

  const [savedUrls, setSavedUrls] = useState<
    inferMutationOutput<"shortenUrl">[]
  >([]);

  const onSuccess: OnSuccess<"shortenUrl"> = ({ data: savedUrl, form }) => {
    setSavedUrls((current) => [...current, savedUrl].slice(-3));
    form.reset();
  };

  return (
    <Flex direction="column" gap={2}>
      <MutationForm mutation={shortenUrl} onSuccess={onSuccess}>
        <Flex align="stretch" gap={2}>
          <TextField
            name="originalUrl"
            inputProps={{
              size: "lg",
              placeholder: "Shorten your link",
              autoComplete: "none",
            }}
          />
          <SubmitButton size="lg">Shorten</SubmitButton>
        </Flex>
      </MutationForm>
      {savedUrls.length > 0 && (
        <List borderWidth="1px" borderRadius="md">
          {savedUrls.map((savedUrl, index) => {
            const { host, protocol } = window.location;

            const shortUrl = `${protocol}//${host}/${savedUrl.slug}`;

            return (
              <ListItem
                key={savedUrl.slug}
                p={3}
                borderBottomWidth={
                  index !== savedUrls.length - 1 ? "1px" : undefined
                }
                display="flex"
                gap={2}
              >
                <Box flex={1}>{savedUrl.originalUrl}</Box>
                <NextLink href={shortUrl} passHref>
                  <Link>{shortUrl}</Link>
                </NextLink>
              </ListItem>
            );
          })}
        </List>
      )}
    </Flex>
  );
}
