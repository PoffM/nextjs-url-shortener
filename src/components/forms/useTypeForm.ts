import {
  ControllerFieldState,
  FieldPath,
  FieldValues,
  PathValue,
  RefCallBack,
  UnpackNestedValue,
  useController,
  useForm,
  UseFormProps,
} from "react-hook-form";

export interface FieldHandle<T> {
  name: string;
  useController: () => {
    fieldProps: {
      onChange: (newVal: T) => void;
      onBlur: () => void;
      value: UnpackNestedValue<T>;
      name: string;
      ref: RefCallBack;
    };
    fieldState: ControllerFieldState;
  };
}

/**
 * Wrapper around react-hook-form's useForm for better type safety on field names and types.
 *
 * @example
 * ```
 * const { field } = useForm<{ post: string }>();
 *
 * const fieldHandle = field("post"); // Type-safe "post" key which returns a FieldHandle<string>.
 *
 * // The field's value and onChange properties are type-safe:
 * const value: string = fieldHandle.fieldProps.value;
 * fieldHandle.fieldProps.onChange("My post");
 * ```
 */
export function useTypeForm<TFieldValues extends FieldValues = FieldValues>(
  props?: UseFormProps<TFieldValues>
) {
  const form = useForm<TFieldValues, FieldValues>(props);

  function field<Key extends FieldPath<TFieldValues>>(
    name: Key
  ): FieldHandle<PathValue<TFieldValues, Key>> {
    return {
      name,
      useController: () => {
        const {
          fieldState,
          field: { onBlur, value, ref, onChange },
        } = useController({ name, control: form.control });
        return {
          fieldProps: {
            name,
            onBlur,
            value,
            ref,
            onChange: (newVal) => onChange(newVal),
          },
          fieldState,
        };
      },
    };
  }

  return { ...form, field };
}
