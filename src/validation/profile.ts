
import { Translations } from "@/types/Translations";
import { z } from "zod";

export const updateProfileSchema = (translations: Translations) => {
  return z.object({
    username: z
      .string()
      .trim()
      .min(1, { message: translations.validation.firstNameRequired }),
    email: z.string().trim().email({
      message: translations.validation.validEmail,
    }),
    gender: z.string().min(1, { message: translations.validation.firstNameRequired }).optional(),
    age: z.string().min(1, { message: translations.validation.lastNameRequired }).optional(),
    phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        
        return /^01\d{9}$/.test(value);
      },
      {
        message: translations.profile?.form?.phone?.validation?.invalid,
      }
    ),
  
    image: z.custom((val) => val instanceof File).optional(),
  });
};


export const updateProfileDoctorSchema = (translations: Translations) => {
  return z.object({
    username: z
    .string()
    .trim()
    .min(1, { message: translations.validation.firstNameRequired }),
  email: z.string().trim().email({
    message: translations.validation.validEmail,
  }),
    bio_ar: z
      .string()
      .trim()
      .min(1, { message: translations.validation.bioAr}),
    
    bio_en: z
      .string()
      .trim()
      .min(1, { message: translations.validation.bioEn}),

    address_ar: z
      .string()
      .trim()
      .min(1, { message: translations.validation.addressAr }),

    address_en: z
      .string()
      .trim()
      .min(1, { message: translations.validation.addressEn  }),

    experience: z
      .string()
      .trim()
      .min(1, { message: translations.validation.experience })
      .refine((val) => /^\d+$/.test(val), {
        message: "يجب أن يكون عدد سنوات الخبرة رقمًا فقط",
      }),

    image: z.custom<File>((val) => val instanceof File, {
      message: "يرجى تحميل صورة صالحة",
    }).optional(),
  });
};


