import { Translations } from "@/types/Translations";
import * as z from "zod";

export const addDoctorSchema = (translations: Translations) => {
  return z.object({
    firstname: z
      .string()
      .trim()
      .min(1, translations.validation.firstNameRequired),
    lastname: z
      .string()
      .trim()
      .min(1, translations.validation.lastNameRequired),
    firstnameAr: z
      .string()
      .trim()
      .min(1, translations.validation.firstNameRequired),
    lastnameAr: z
      .string()
      .trim()
      .min(1, translations.validation.lastNameRequired),
    email: z
      .string()
      .trim()
      .email({ message: translations.validation.validEmail }),
    password: z
      .string()
      .min(6, { message: translations.validation.passwordMinLength })
      .max(40, { message: translations.validation.passwordMaxLength }),
    specialization: z
      .string()
      .trim()
      .min(1, translations.validation.specialty),

   
    available: z
      .enum(["true", "false"])
      .transform((val) => val === "true"),
  });
};
