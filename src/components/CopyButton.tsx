import { Button, ButtonProps } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { useMutation } from "react-query";

export interface CopyPasteButtonProps extends ButtonProps {
  text: string;
}

/** Copy the text to the clipboard and show a  */
export function CopyButton({
  children = "Copy",
  text,
  ...props
}: CopyPasteButtonProps) {
  async function copyAndThenShowSuccessMessage() {
    await navigator.clipboard.writeText(text);
    await new Promise((res) => setTimeout(res, 1000));
  }

  const copiedMessageTimeout = useMutation({
    mutationFn: copyAndThenShowSuccessMessage,
  });

  const showCopiedMessage = copiedMessageTimeout.isLoading;

  const copyToClipboard: MouseEventHandler<HTMLButtonElement> = (e) => {
    props.onClick?.(e);
    copiedMessageTimeout.mutate();
  };

  return (
    <Button
      w="5rem"
      {...props}
      onClick={copyToClipboard}
      colorScheme={showCopiedMessage ? "green" : undefined}
    >
      {showCopiedMessage ? "Copied!" : children}
    </Button>
  );
}
