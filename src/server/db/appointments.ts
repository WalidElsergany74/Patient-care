import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";


export const getAppointments = cache(
  async (patientId) => {
    const currentDate = new Date();

    await db.appointment.updateMany({
      where: {
        appointmentTime: { lt: currentDate }, 
        status: "PENDING", 
      },
      data: { status: "CANCELLED" },
    });
    
    const appointments = await db.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            username: true,
            username_ar : true,
            specialty: {
             select : {
              name : true,
              name_ar : true
             }
            },
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return appointments;
  },
  ["appointments"],
  {
    revalidate: 3600,
    tags: ["appointments"], 
  }
);

export const getAppointmentsDoctors = cache(
  async (doctorId) => {
    const currentDate = new Date();

    await db.appointment.updateMany({
      where: {
        appointmentTime: { lt: currentDate }, 
        status: "PENDING", 
      },
      data: { status: "CANCELLED" },
    });
    
    const appointments = await db.appointment.findMany({
      where: { doctorId },
      include: {
        doctor : {
          select : {
            price : true,
       username: true,
    username_ar: true,
    image: true,
          },
        },
        patient: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return appointments;
  },
  ["appointmentsDoctors"],
  {
    revalidate: 3600,
    tags: ["appointmentsDoctors"], 
  }
);
export const getAppointmentsAdmin = cache(
  async () => {
    const currentDate = new Date();

   
    await db.appointment.updateMany({
      where: {
        appointmentTime: { lt: currentDate },
        status: "PENDING",
      },
      data: { status: "CANCELLED" },
    });

  
    const appointments = await db.appointment.findMany({
      include: {
        doctor: {
          select: {
            price: true,
            username: true,       
            username_ar: true,     
            image: true,          
          },
        },
        patient: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return appointments;
  },
  ["appointmentsAdmin"],
  {
    revalidate: 3600,
    tags: ["appointmentsAdmin"],
  }
);


export const getSlotsDoctor = cache(
  async (doctorId) => {
    

    
   const slots = db.availableTimeSlot.findMany({
    where : {doctorId},
    include : {
      doctor : {
        select : {
          AvailableTimeSlot : true
        }
      }
    }
   })

   return slots
  },
  ["slotsDoctors"],
  {
    revalidate: 3600,
    tags: ["slotsDoctors"], 
  }
);

