import { createContext, useContext } from "react";
import { useFormContext } from "react-hook-form";

type FormFieldContextValue = {
  name: string;
  id: string;
};

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null
);

export const useFormField = () => {
  const context = useContext(FormFieldContext);
  const { getFieldState } = useFormContext();

  if (!context) throw new Error("FormField debe usarse dentro de FormField");

  const fieldState = getFieldState(context.name);

  return {
    ...context,
    error: fieldState.error,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
    formItemId: `${context.id}-item`,
    formDescriptionId: `${context.id}-description`,
    formMessageId: `${context.id}-message`,
  };
};
