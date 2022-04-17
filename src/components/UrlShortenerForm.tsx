import { Flex } from "@chakra-ui/react";
import { trpc } from "~/utils/trpc";
import { MutationForm } from "./forms/MutationForm";
import { SubmitButton } from "./forms/SubmitButton";
import { TextField } from "./forms/TextField";

export function UrlShortenerForm() {
  const shortenUrl = trpc.useMutation("shortenUrl");

  return (
    <MutationForm mutation={shortenUrl}>
      <Flex align="stretch" gap={2}>
        <TextField
          name="originalUrl"
          inputProps={{
            size: "lg",
            placeholder: "Shorten your link",
          }}
        />
        <SubmitButton size="lg">Shorten</SubmitButton>
      </Flex>
    </MutationForm>
  );
}
