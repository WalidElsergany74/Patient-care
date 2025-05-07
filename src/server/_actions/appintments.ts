'use server';

import { Routes } from '@/constants';
import { getCurrentLocale } from '@/lib/getCurrentLocale';
import { db } from '@/lib/prisma';
import { User } from '@prisma/client';
import { format, parse } from 'date-fns';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function bookAppointment(date: Date, time: string, user: User, doctorId: string) {
  const locale = await getCurrentLocale()
  try {
    if (!user || user.role !== 'PATIENT') {
      return { error: 'Unauthorized: Only patients can book an appointment' };
    }

    if (!date || isNaN(date.getTime())) {
      return { error: 'Invalid date provided' };
    }

    const formattedDate = format(date, 'yyyy-MM-dd'); 
    const dateTimeString = `${formattedDate} ${time}`; 

   
    const appointmentTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());

    if (isNaN(appointmentTime.getTime())) {
      return { error: 'Invalid time format' };
    }

    const existingAppointment = await db.appointment.findFirst({
      where: {
        doctorId,
        appointmentTime,
      },
    });
    
    if (existingAppointment && existingAppointment.status !== "CANCELLED") {
      return { error: 'This time slot is already booked. Please select another.' };
    }
    
    let appointment;
    
    if (existingAppointment && existingAppointment.status === "CANCELLED") {
      // Update existing cancelled appointment
      appointment = await db.appointment.update({
        where: {
          id: existingAppointment.id,
        },
        data: {
          patientId: user.id,
          status: "PENDING",
        },
      });
    } else {
      // Create new appointment
      appointment = await db.appointment.create({
        data: {
          appointmentTime,
          patientId: user.id,
          doctorId,
          status: "PENDING",
        },
      });
    }
    
    revalidatePath(`/${locale}/${Routes.REVERSATION}`);
    revalidatePath(`/${locale}/doctorAdmin/appointments`);
    revalidatePath(`/${locale}/doctorAdmin`);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/admin/appointments`);
    revalidateTag("appointments");
    revalidateTag("appointmentsDoctors");
    revalidateTag("appointmentsAdmin");
    
    return { success: true, appointment };
    

  } catch (error) {
    console.error('Error booking appointment:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
export async function deleteAppointment(id: string) {
  await db.appointment.update({
    where: { id }, 
    data: {
      status: "CANCELLED"
    }
  });

  revalidatePath("/reversations"); 
  revalidateTag("appointments")
}

