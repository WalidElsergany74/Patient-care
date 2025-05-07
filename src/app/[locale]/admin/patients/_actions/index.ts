"use server"

import { getCurrentLocale } from "@/lib/getCurrentLocale"
import { db } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"

export const deletePatient = async (patientId  : string) => {
    const locale = await getCurrentLocale()
   await db.user.delete({
    where : {
        id : patientId
    }
   })
   revalidatePath(`/${locale}/admin/patients`)
   revalidateTag("patients")
}