import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, List, ListItem } from "@chakra-ui/react";
import { uniqueId } from "lodash";
import NextLink from "next/link";
import { useState } from "react";
import { CopyButton } from "~/components/CopyButton";
import { inferMutationInput, inferMutationOutput, trpc } from "~/utils/trpc";
import { MutationForm, OnSuccessFn } from "./forms/MutationForm";
import { SubmitButton } from "./forms/SubmitButton";
import { TextField } from "./forms/TextField";
import { useTypeForm } from "./forms/useTypeForm";

/** Add a unique ID for the React key when rendering the UI. */
interface LocalShortenedUrl extends inferMutationOutput<"shortenUrl"> {
  key: string;
}

export function UrlShortenerForm() {
  const shortenUrl = trpc.useMutation("shortenUrl");
  const { field, ...form } = useTypeForm<inferMutationInput<"shortenUrl">>();

  const [savedUrls, setSavedUrls] = useState<LocalShortenedUrl[]>([]);

  const onSuccess: OnSuccessFn<"shortenUrl"> = ({ data: savedUrl, form }) => {
    setSavedUrls((current) =>
      [{ ...savedUrl, key: uniqueId() }, ...current].slice(0, 3)
    );
    form.reset();
  };

  return (
    <Flex direction="column" gap={2}>
      <MutationForm mutation={shortenUrl} form={form} onSuccess={onSuccess}>
        <Flex align="stretch" gap={2}>
          <TextField
            field={field("originalUrl")}
            inputProps={{
              size: "lg",
              placeholder: "Shorten your link",
              autoComplete: "off",
            }}
          />
          <SubmitButton size="lg" formCtx={form}>
            Shorten
          </SubmitButton>
        </Flex>
      </MutationForm>
      {savedUrls.length > 0 && (
        <List borderWidth="1px" borderRadius="md">
          {savedUrls.map((savedUrl, index) => {
            const { host, protocol } = window.location;

            const shortUrl = `${protocol}//${host}/${savedUrl.slug}`;

            return (
              <ListItem
                key={savedUrl.key}
                p={3}
                borderBottomWidth={
                  index !== savedUrls.length - 1 ? "1px" : undefined
                }
                display={{ sm: "flex" }}
                alignItems="center"
              >
                <Box
                  flex={1}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  title={savedUrl.originalUrl}
                >
                  {savedUrl.originalUrl}
                </Box>
                <Flex gap={2}>
                  <NextLink href={shortUrl} passHref>
                    <Link
                      color="teal.400"
                      target="_blank"
                      display="flex"
                      alignItems="center"
                    >
                      {shortUrl} <ExternalLinkIcon mx="2px" />
                    </Link>
                  </NextLink>
                  <CopyButton text={shortUrl} />
                </Flex>
              </ListItem>
            );
          })}
        </List>
      )}
    </Flex>
  );
}
