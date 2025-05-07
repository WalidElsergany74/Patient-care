import {  Prisma } from "@prisma/client";

export type DoctorWithRelations = Prisma.DoctorGetPayload<{
  include: {
   specialty : true,
   AvailableTimeSlot :true,
   

  };
}>;
export type AppointmentsWithRelations = Prisma.DoctorGetPayload<{
 include : {
   patient : {
    username : true
   },
   doctor : {
    price : true
   },
 }
}>;