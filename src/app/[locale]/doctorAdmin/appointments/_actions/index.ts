"use server"

import { Routes } from "@/constants"
import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"

export const updateStatusAppointmentCancel = async (appointmentId :  string) => {
    const locale = await getCurrentLocale()
       await db.appointment.update({
        where : {id : appointmentId},
        data : {
            status : "CANCELLED"
        }
       })
       revalidatePath(`/${locale}/${Routes.DOCTORADMIN}/appointments`)
       revalidatePath(`/${locale}/${Routes.REVERSATION}`)
       revalidatePath(`/${locale}`)
     revalidatePath(`/${locale}/admin/appointments`)
     revalidatePath(`/${locale}/admin`)
       revalidateTag("appointments")
       revalidateTag("appointmentsDoctors")
}
export const updateStatusAppointmentConfirm = async (appointmentId :  string) => {
    const locale = await getCurrentLocale()
       await db.appointment.update({
        where : {id : appointmentId},
        data : {
            status : "CONFIRMED"
        }
       })
       revalidatePath(`/${locale}/${Routes.DOCTORADMIN}/appointments`)
       revalidatePath(`/${locale}/${Routes.DOCTORADMIN}`)
       revalidatePath(`/${locale}/${Routes.REVERSATION}`)
    revalidatePath(`/${locale}/admin/appointments`)
       revalidateTag("appointments")
         revalidatePath(`/${locale}`)
     revalidatePath(`/${locale}/admin`)
       revalidatePath(`/${locale}`)
       revalidateTag("appointmentsDoctors")
}
