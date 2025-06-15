// src/components/ui/hooks/use-form-field.ts
import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormFieldContext,
  type FormFieldContextValue,
  FormItemContext,
  type FormItemContextValue,
} from "../contexts/form-contexts"; // Path to form.tsx

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  // Added type assertion for name, assuming FieldValues as the default if not specified elsewhere.
  const fieldState = getFieldState(fieldContext.name as FieldPath<FieldValues>, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  // Ensure itemContext is checked. If it's possible for it to be undefined when useFormField is called,
  // this check is important. Original code implies it's always expected.
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem> or a component that provides FormItemContext");
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
};
