
import { cache } from "@/lib/cache";

import { db } from "@/lib/prisma";

export const getSpecialties = cache(
  async () => {
    try {
      const specialties = await db.specialty.findMany({
        select: {
          id :  true,
          name: true,
          name_ar: true,
        },
      });

      return specialties; 
    } catch (error) {
      console.error("Error fetching specialties:", error);
      return [];
    }
  },
  ["specialties"],
  { revalidate: 3600 }
);

