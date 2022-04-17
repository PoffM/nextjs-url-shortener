import { Button, ButtonProps } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export function SubmitButton(buttonProps: ButtonProps) {
  const form = useFormContext();
  form.formState.errors;

  return (
    <Button
      type="submit"
      isLoading={form.formState.isSubmitting}
      {...buttonProps}
    >
      {buttonProps.children ?? "Submit"}
    </Button>
  );
}
