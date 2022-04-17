import {
  BoxProps,
  FormControl,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";

export interface TextFieldProps extends BoxProps {
  name: string;
  inputProps?: InputProps;
}

export function TextField({ name, inputProps, ...boxProps }: TextFieldProps) {
  const { field, fieldState } = useController({ name });

  const fieldError = fieldState.error;

  return (
    <FormControl {...boxProps} isInvalid={fieldState.invalid}>
      <Input {...field} value={String(field.value ?? "")} {...inputProps} />
      {fieldError && <FormErrorMessage>{fieldError.message}</FormErrorMessage>}
    </FormControl>
  );
}
