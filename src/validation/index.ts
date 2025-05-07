import { Translations } from "@/types/Translations";
import *  as z from "zod";
export const loginSchema = (translations: Translations) => {
  return z.object({
    email: z.string().trim().email({
      message: translations.validation.validEmail,
    }),
    password: z
      .string()
      .min(6, { message: translations.validation.passwordMinLength })
      .max(40, { message: translations.validation.passwordMaxLength }),
  });
};
  export const signUpSchema = (translations : Translations) => {
    return z.object({
      firstname : z.string().trim().min(1 ,translations.validation.firstNameRequired),
        lastname : z.string().trim().min(1 , translations.validation.lastNameRequired),
        email: z.string().trim().email({
          message: translations.validation.validEmail,
        }),
        password: z
        .string()
        .min(6, { message: translations.validation.passwordMinLength })
        .max(40, { message: translations.validation.passwordMaxLength }),
        confirmPassword: z
        .string()
        .min(6, { message: translations.validation.confirmPasswordRequired }),
    }).refine((data) => data.password === data.confirmPassword, {
      message: translations.validation.passwordMismatch,
      path: ["confirmPassword"],
    });

  }

export type ValidationErrors =
  | {
      [key: string]: string[];
    }
  | undefined;