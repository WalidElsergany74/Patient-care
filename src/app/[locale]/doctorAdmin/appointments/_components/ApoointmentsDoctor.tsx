"use client";

import { useState, useCallback, useEffect } from "react";
import { updateStatusAppointmentCancel, updateStatusAppointmentConfirm } from "../_actions";
import AppointmentSearch from "./AppointmentSearch";
import AppointmentCardList from "./AppointmentCardList";
import AppointmentTable from "./AppointmentTable";
import { Translations } from "@/types/Translations";
import { Locale } from "@/i18n.config";
interface Doctor {
  price: number | null;
}

interface Patient {
  id: string;
  username: string;
  image: string | null;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentTime: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
  doctor: Doctor;
  patient: Patient;
}


type Props = {
  appointments: Appointment[];
  translations : Translations,
  locale : Locale
  viewAs: "doctor" | "admin";
};

export default function AppointmentsDoctor({ appointments , translations , locale,viewAs }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentsList, setAppointmentsList] = useState(appointments);
  const [loadingState, setLoadingState] = useState<{
    id: string | null;
    action: "CONFIRMED" | "CANCEL" | null;
  }>({ id: null, action: null });

  const filteredAppointments = appointmentsList.filter((appointment) =>
    appointment.patient.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = useCallback((id: string, status: "CONFIRMED" | "CANCELLED") => {
    setAppointmentsList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  }, []);

  const handleUpdateConfirm = useCallback(async (appointmentId: string) => {
    setLoadingState({ id: appointmentId, action: "CONFIRMED" });
    try {
      await updateStatusAppointmentConfirm(appointmentId);
      handleStatusChange(appointmentId, "CONFIRMED");
    } catch (error) {
      console.error("Error confirming appointment", error);
    } finally {
      setLoadingState({ id: null, action: null });
    }
  }, [handleStatusChange]);

  const handleUpdateCancel = useCallback(async (appointmentId: string) => {
    setLoadingState({ id: appointmentId, action: "CANCEL" });
    try {
      await updateStatusAppointmentCancel(appointmentId);
      handleStatusChange(appointmentId, "CANCELLED");
    } catch (error) {
      console.error("Error cancelling appointment", error);
    } finally {
      setLoadingState({ id: null, action: null });
    }
  }, [handleStatusChange]);

  useEffect(() => {
    setAppointmentsList(appointments);
  }, [appointments]);

  return (
    <div className="space-y-6 mb-16">
      <AppointmentSearch
      viewAs={viewAs}
       translations={translations}
          locale={locale} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="block lg:hidden">
        <AppointmentCardList
          appointments={filteredAppointments}
          translations={translations}
          loadingState={loadingState}
          onConfirm={handleUpdateConfirm}
          onCancel={handleUpdateCancel}
        />
      </div>
      <div className="hidden lg:block">
        <AppointmentTable
          appointments={filteredAppointments}
          translations={translations}
          loadingState={loadingState}
          onConfirm={handleUpdateConfirm}
          onCancel={handleUpdateCancel}
          viewAs={viewAs}
        />
      </div>
    </div>
  );
}