import {
  BoxProps,
  FormControl,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { FieldHandle } from "./useTypeForm";

export interface TextFieldProps extends BoxProps {
  field: FieldHandle<string>;
  inputProps?: InputProps;
}

export function TextField({ field, inputProps, ...boxProps }: TextFieldProps) {
  const { fieldProps, fieldState } = field.useController();

  const fieldError = fieldState.error;

  return (
    <FormControl {...boxProps} isInvalid={!!fieldState.error}>
      <Input
        {...fieldProps}
        value={String(fieldProps.value ?? "")}
        onChange={(e) => fieldProps.onChange(e.target.value)}
        {...inputProps}
      />
      {fieldError && <FormErrorMessage>{fieldError.message}</FormErrorMessage>}
    </FormControl>
  );
}
