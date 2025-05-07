"use server"

import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"

export const deleteDoctors = async (patientId  : string) => {
    const locale = await getCurrentLocale()
   await db.user.delete({
    where : {
        id : patientId
    }
   })
   revalidatePath(`/${locale}/admin/doctors`)
   revalidatePath(`/${locale}/admin`)
   revalidatePath(`/${locale}/admin/appointments`)
   revalidatePath(`/${locale}/doctorAdmin/appointments`)
   revalidatePath(`/${locale}/doctorAdmin`)
   revalidatePath(`/${locale}/doctors`)
   revalidatePath(`/${locale}`)
   revalidateTag("allDoctors")
}
export const updateDoctorAvailability = async (doctorId: string, isAvailable: boolean) => {
    const locale = await getCurrentLocale()
    await db.user.update({
      where: { id: doctorId },
      data: {
        availability: isAvailable,
      },
    });
    revalidatePath(`/${locale}/admin/doctors`)
    revalidatePath(`/${locale}`)
    revalidatePath(`/${locale}/doctors`)
    revalidateTag("allDoctors")
  };
  