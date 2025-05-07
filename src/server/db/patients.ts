"use server"

import { cache } from "@/lib/cache"
import { db } from "@/lib/prisma"

export const getPatients = cache(
    async () =>  {
        const patients = await db.user.findMany({
            where : {
                role : "PATIENT"
            },
            select : {
                id : true,
                createdAt : true,
                username : true,
                image : true,
                age : true,
                gender : true,
                phone : true,
                email : true,
            }
        })
        return patients
    },
    ["patients"],
    {
    tags :  ["patients"],
    revalidate : 3600
    }
)
export const getPatient = cache(
    async (patientId: string) => {
      const patient = await db.user.findUnique({ where: { id: patientId } });
      return patient;
    },
    ["aaaaa"],
    {

      revalidate: 3600
    }
  );
  
  
