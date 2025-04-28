import React, { createContext, useContext } from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Text, View } from "react-native";

import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { useAutoId } from "@/shared/hooks/use-auto-id";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

const FormItemContext = createContext<{ id: string }>({} as { id: string });

function FormItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) {
  const id = useAutoId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View className={cn("mb-4", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label>) {
  const { error } = useFormField();

  return (
    <Label className={cn(error ? "text-red-500" : "", className)} {...props} />
  );
}

function FormControl({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function FormDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  const { formDescriptionId } = useFormField();

  return (
    <Text
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
      nativeID={formDescriptionId}
      {...props}
    />
  );
}

function FormMessage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  const { error, formMessageId } = useFormField();

  if (!error?.message) return null;

  return (
    <Text
      className={cn("text-sm font-medium text-red-500", className)}
      nativeID={formMessageId}
      accessibilityRole="alert"
      {...props}
    >
      {String(error.message)}
    </Text>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
