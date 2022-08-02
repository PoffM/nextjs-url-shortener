import { Button, ButtonProps } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export interface SubmitButtonProps extends ButtonProps {
  formCtx: Pick<ReturnType<typeof useForm>, "formState">;
}

export function SubmitButton({ formCtx, ...buttonProps }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      isLoading={formCtx.formState.isSubmitting}
      {...buttonProps}
    >
      {buttonProps.children ?? "Submit"}
    </Button>
  );
}
