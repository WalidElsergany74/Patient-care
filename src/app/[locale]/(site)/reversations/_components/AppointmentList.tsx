"use client";

import { useTransition } from "react";
import AppointmentCard from "./AppointmentCard";
import { deleteAppointment } from "@/server/_actions/appintments";
import { Appointment } from "@prisma/client";
import { toast } from "sonner";
import { Translations } from "@/types/Translations";
import { Locale } from "@/i18n.config";


interface AppointmentListProps {
  appointments: Appointment[];
  isExpired?: boolean;
  translations : Translations;
  locale : Locale;
}

export default function AppointmentList({ appointments, isExpired , translations , locale}: AppointmentListProps) {
  const [isPending, startTransition] = useTransition();
  

  async function handleDeleteAppointment(id: string) {
    startTransition(async () => {
      await deleteAppointment(id);
      toast.success("Booking  Deleted")
    });
    
  }

  return (
    <div className="space-y-4 mt-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onDelete={isExpired ? undefined : handleDeleteAppointment}
            isExpired={isExpired}
            isPending={isPending}
            translations={translations}
            locale={locale}
          />
        ))
      ) : (
        <p className="text-gray-500">{isExpired ?  translations.reservation.noExpired : translations.reservation.noUpcoming}</p>
      )}
    </div>
  );
}
