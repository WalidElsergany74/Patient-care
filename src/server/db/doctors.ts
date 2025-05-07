import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getDoctorsBySpecialty = cache(
  async () => {
    const doctors = await db.specialty.findMany({
      where: {
        doctors: {
          some: {
            availability: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        doctors: {
          where: {
            availability: true,
          },
          select: {
            id: true,
            image: true,
            username: true,
            username_ar: true,
            bio_ar: true,
            bio_en: true,
            price: true,
            address_ar: true,
            address_en: true,
            specialty: {
              select: {
                name: true,
                name_ar: true,
              },
            },
            AvailableTimeSlot: {
              select: {
                day: true,
                timeSlot: true,
              },
            },
          },
        },
      },
    });
    return doctors;
  },
  ["doctors-by-specialty"],
  {
    revalidate: 3600,
    tags: ["doctors-by-specialty"],
  }
);





  
export const getDoctorsWithAvailability = cache(
    async () => {
      const doctors = await db.user.findMany({
        where: { role: "DOCTOR" },
        select: {
          id: true,
          username: true,
          image: true,
          specialty: {
            select: { name: true }
          },
          AvailableTimeSlot: {  
            select: {
              day: true,
              timeSlot: true
            }
          }
        }
      });
  
      
      return doctors.map((doctor) => ({
        ...doctor,
        availableDays: [...new Set(doctor.AvailableTimeSlot.map(slot => slot.day))],
      }));
    },
    ["doctors-with-availability"],
    { revalidate: 3600,
    tags :   ["doctors-with-availability"]
     }
  );
  
  


export const getSingleDoctor = cache(
  async (doctorId: string) => {
    const doctor = await db.user.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        username: true,
        username_ar : true,
        experience : true,
        image: true,
        price: true,
        bio_ar : true,
        bio_en : true,
        address_ar: true,
        address_en: true,
        email: true,
        specialty: {
          select: { 
            name: true ,
            name_ar :true,
            
           },
        },
        AvailableTimeSlot: {
          select: {
            day: true,
            timeSlot: true,
          },
        },
      },
    });

    return doctor;
  },
  ["single-doctor"],
  { 
    revalidate: 3600,
    tags : ["single-doctor"]
  }
);


export const getAllDoctor = cache(
  async () => {
    const doctor = await db.user.findMany({
      where: { role : "DOCTOR" },
      select: {
        id: true,
        username: true,
        username_ar : true,
        experience : true,
        image: true,
        price: true,
        bio_ar : true,
        bio_en : true,
        address_ar: true,
        availability : true,
        address_en: true,
        email: true,
        specialty: {
          select: { 
            name: true ,
            name_ar :true,
           },
        },
        AvailableTimeSlot: {
          select: {
            day: true,
            timeSlot: true,
          },
        },
      },
    });

    return doctor;
  },
  ["allDoctors"],
  { 
    revalidate: 3600,
    tags : ["allDoctors"]
  }
);