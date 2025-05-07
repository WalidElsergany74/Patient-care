"use server";


import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import { WeekDay } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export const addSlot = async (
  doctorId: string,
  day: WeekDay,
  timeSlot: string
) => {
  const locale = await getCurrentLocale();
  try {
    const createdSlot = await db.availableTimeSlot.create({
      data: {
        doctorId,
        day,
        timeSlot,
      },
    });

   
    revalidateTag("slotsDoctors"); 
    revalidateTag("doctors-with-availability");
    revalidateTag("doctors-by-specialty")


    
    revalidatePath(`/${locale}/doctorAdmin/availability`);
    revalidatePath(`/${locale}/doctorAdmin`);
    revalidatePath(`/${locale}/`);
    revalidatePath(`/${locale}`);

    return { success: true, data: createdSlot };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating slot:", error);
    return { success: false, message: error.message };
  }
};

export const deleteSlot = async (
  doctorId: string,
  day: WeekDay,
  timeSlot: string
) => {
  const locale = await getCurrentLocale();
  try {
    const deleted = await db.availableTimeSlot.deleteMany({
      where: {
        doctorId,
        day,
        timeSlot,
      },
    });

    revalidateTag("slotsDoctors"); 
    revalidateTag("doctors-with-availability");
    revalidateTag("doctors-by-specialty")


    
    revalidatePath(`/${locale}/doctorAdmin/availability`);
    revalidatePath(`/${locale}/doctorAdmin`);
    revalidatePath(`/${locale}/`);
    revalidatePath(`/${locale}`);
    

    return { success: true, data: deleted };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting slot:", error);
    return { success: false, message: error.message };
  }
};
