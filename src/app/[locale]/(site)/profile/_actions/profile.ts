"use server";

import {  Routes } from "@/constants";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translations";
import { updateProfileSchema } from "@/validation/profile";
import { UserRole } from "@prisma/client";


import { revalidatePath } from "next/cache";

export const updateProfile = async (
  isAdmin: boolean,
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = updateProfileSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
    };
  }
  const data = result.data;
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;

  try {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return {
        message: translations.messages.userNotFound,
        status: 401,
        formData,
      };
    }
    await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        ...data,
        image: imageUrl ?? user.image,
        age : Number(data.age),
        gender : data.gender,
        role: isAdmin ? UserRole.ADMIN : UserRole.PATIENT,
      },
    });
    revalidatePath(`/${locale}/${Routes.PROFILE}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/profile`);
  
    return {
      status: 200,
      message: translations.messages.updateProfileSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "profile_images");

  try {
    const response = await fetch(
       `https://patient-care-zeta.vercel.app/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const image = (await response.json()) as { url: string };
    return image.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
  }
};
