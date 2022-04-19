import { FormErrorMessage } from "@chakra-ui/react";
import { toPairs } from "lodash";
import { PropsWithChildren, useState } from "react";
import {
  DeepPartial,
  FormProvider,
  Path,
  UnpackNestedValue,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { UseMutationResult } from "react-query";
import type { AppRouter } from "~/server/routers/appRouter";
import { inferMutationInput, inferMutationOutput, trpc } from "~/utils/trpc";

type MutationKey = keyof AppRouter["_def"]["mutations"];

export type MutationFormProps<
  TPath extends MutationKey,
  TInput = inferMutationInput<TPath>,
  TOutput = inferMutationOutput<TPath>
> = PropsWithChildren<{
  mutation: UseMutationResult<
    TOutput,
    ReturnType<typeof trpc.useMutation>["error"],
    TInput
  >;
  defaultValues?: UnpackNestedValue<DeepPartial<TInput>>;
  onSuccess?: OnSuccess<TPath, TInput, TOutput>;
}>;

export type OnSuccess<
  TPath extends MutationKey,
  TInput = inferMutationInput<TPath>,
  TOutput = inferMutationOutput<TPath>
> = (args: {
  form: UseFormReturn<TInput>;
  data: TOutput;
}) => Promise<unknown> | void;

/**
 * Renders a form that:
 * * Provides react-hook-form context.
 * * Submits the data with a TRPC mutation.
 * * Provides form and field error messages from the back-end.
 */
export function MutationForm<
  TPath extends MutationKey,
  TInput = inferMutationInput<TPath>,
  TOutput = inferMutationOutput<TPath>
>({
  children,
  mutation,
  defaultValues,
  onSuccess,
}: MutationFormProps<TPath, TInput, TOutput>) {
  const form = useForm<TInput>({ defaultValues });

  // Top-level form error message:
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (input) => {
    setFormError(null);
    try {
      return await mutation.mutateAsync(input as TInput, {
        onSuccess: (data) => onSuccess?.({ data, form }),
        onError: (error) => {
          const zodError = error?.data?.zodError;
          if (zodError) {
            for (const [field, messages] of toPairs(zodError.fieldErrors)) {
              const message = messages?.join(", ");
              if (message) {
                form.setError(field as Path<TInput>, { message });
              }
            }
            const formErrorMessage = zodError.formErrors?.join(", ");
            if (formErrorMessage) {
              setFormError(formErrorMessage);
            }
          }
        },
      });
      // eslint-disable-next-line no-empty
    } catch {}
  });

  return (
    <FormProvider {...form}>
      {formError ? "" : <FormErrorMessage>{formError}</FormErrorMessage>}
      <form onSubmit={(e) => void onSubmit(e)}>{children}</form>
    </FormProvider>
  );
}
