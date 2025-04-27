// components/ui/form.tsx
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { ReactElement, ReactNode, cloneElement } from "react";

import { useAutoId } from "@/shared/hooks/use-auto-id";
import { FormFieldContext, useFormField } from "@/shared/hooks/use-form-field";
import { cn } from "@/shared/lib/utils";

export const Form = FormProvider;

export const FormField = ({
  name,
  render,
}: {
  name: string;
  render: (props: { id: string }) => ReactNode;
}) => {
  const id = useAutoId();
  const { control } = useFormContext();

  return (
    <FormFieldContext.Provider value={{ name, id }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {render({
              id,
              ...field,
            })}
          </>
        )}
      />
    </FormFieldContext.Provider>
  );
};

export const FormItem = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const { formItemId } = useFormField();

  return (
    <View className={cn("mb-4 space-y-2", className)} nativeID={formItemId}>
      {children}
    </View>
  );
};

export const FormLabel = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const { error, formItemId } = useFormField();

  return (
    <Text
      className={cn(
        "text-sm font-medium text-gray-900 dark:text-gray-50 mb-2",
        error && "text-red-500",
        className
      )}
      nativeID={formItemId}
    >
      {children}
    </Text>
  );
};

export const FormControl = ({ children }: { children: ReactNode }) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return cloneElement(children as ReactElement, {
    accessibilityLabelledBy: formItemId,
    accessibilityDescribedBy: `${formDescriptionId} ${formMessageId}`,
    accessibilityInvalid: !!error,
  });
};

export const FormDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const { formDescriptionId } = useFormField();

  return (
    <Text
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
      nativeID={formDescriptionId}
    >
      {children}
    </Text>
  );
};

export const FormMessage = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  const { error, formMessageId } = useFormField();
  const body = error ? error.message : children;

  if (!body) return null;

  return (
    <Text
      className={cn("text-sm font-medium text-red-500", className)}
      nativeID={formMessageId}
      accessibilityRole="alert"
    >
      {body}
    </Text>
  );
};
