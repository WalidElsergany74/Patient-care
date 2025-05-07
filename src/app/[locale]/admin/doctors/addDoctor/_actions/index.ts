"use server"

import bcrypt from "bcrypt";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translations";
import { addDoctorSchema } from "@/validation/addDcotor";
import { revalidatePath } from "next/cache";

export const addDoctorAction = async (prevState: unknown, formData: FormData) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  const result = addDoctorSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData
    };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email: result.data.email
      }
    });

    if (existingUser) {
      return {
        status: 409,
        message: translations.messages.userAlreadyExists,
        formData
      };
    }

    const fullName = `${result.data.firstname} ${result.data.lastname}`.trim();
    const fullNameAr = `${result.data.firstnameAr} ${result.data.lastnameAr}`.trim();
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const createdUser = await db.user.create({
      data: {
        username: fullName,
        username_ar : fullNameAr,
        email: result.data.email,
        password: hashedPassword,
        specialty: {
          connect: {
            id: result.data.specialization
          }
        },
        role: "DOCTOR",
        availability: result.data.available 
      },
      include: {
        specialty: true
      }
    });
    revalidatePath(`/${locale}/admin/doctors`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/doctors`);
    return {
      status: 201,
      message: translations.messages.accountCreated,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        specialty: createdUser.specialty,
        availability: createdUser.availability
      }
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError
    };
    
  }
};
