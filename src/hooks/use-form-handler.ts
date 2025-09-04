"use client";

import { useState, useCallback } from "react";
import {
  useForm,
  FieldValues,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAsyncOperation } from "./use-async-operation";

/**
 * Hook personalizado para manejar formularios con validación y estados
 * Elimina la duplicación de código en formularios
 */
export function useFormHandler<
  TFieldValues extends FieldValues = FieldValues,
  TSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema
>(
  schema: TSchema,
  defaultValues?: DefaultValues<TFieldValues>
): {
  form: UseFormReturn<TFieldValues>;
  loading: boolean;
  error: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  handleSubmit: (
    onSubmit: (data: TFieldValues) => Promise<void>,
    onSuccess?: () => void
  ) => Promise<void>;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  clearError: () => void;
  setError: (error: string) => Promise<{ success: boolean; error?: string }>;
} {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, error, execute, clearError } = useAsyncOperation();

  const form = useForm<TFieldValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = useCallback(
    async (
      onSubmit: (data: TFieldValues) => Promise<void>,
      onSuccess?: () => void
    ): Promise<void> => {
      return form.handleSubmit(async (data) => {
        const result = await execute(async () => {
          await onSubmit(data);
        });

        if (result.success) {
          onSuccess?.();
        }
      })();
    },
    [execute, form]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const setError = useCallback(
    async (errorMessage: string) => {
      return execute(() => Promise.reject(new Error(errorMessage)));
    },
    [execute]
  );

  return {
    form,
    loading,
    error,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    clearError,
    setError,
  };
}

/**
 * Tipos auxiliares para inferir tipos de Yup schemas
 */
export type InferInput<TSchema extends yup.AnyObjectSchema> = yup.InferType<TSchema>;
export type InferOutput<TSchema extends yup.AnyObjectSchema> = yup.InferType<TSchema>;
