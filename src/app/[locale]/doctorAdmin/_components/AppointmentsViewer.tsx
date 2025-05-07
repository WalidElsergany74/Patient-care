"use client";

import { useState, useCallback, useMemo } from "react";
import { Translations } from "@/types/Translations";
import { Locale } from "@/i18n.config";
import { updateStatusAppointmentCancel, updateStatusAppointmentConfirm } from "../appointments/_actions";
import AppointmentSearch from "../appointments/_components/AppointmentSearch";
import AppointmentCardList from "../appointments/_components/AppointmentCardList";
import AppointmentTable from "../appointments/_components/AppointmentTable";
import { Button } from "@/components/ui/button";
import { Languages } from "@/constants";


export interface ViewerAppointment {
  id: string;
  patient: {
    id: string;
    username: string;
    image: string | null;
  };
  doctor: {
    id?: string;
    price?: number | null;
    username?: string;
    username_ar?: string;
    image?: string | null;
  };
  appointmentTime: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  appointments: ViewerAppointment[];
  translations: Translations;
  locale: Locale;
  viewAs: "doctor" | "admin";
}

export default function AppointmentsViewer({
  appointments,
  translations,
  locale,
  viewAs,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentsList, setAppointmentsList] = useState(appointments);
  const [loadingState, setLoadingState] = useState<{
    id: string | null;
    action: "CONFIRMED" | "CANCEL" | null;
  }>({ id: null, action: null });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

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
  
  const filteredAppointments = useCallback(() => {
    return appointments
      .map((app) => {
      
        const updated = appointmentsList.find((a) => a.id === app.id);
        return updated ?? app;
      })
      .filter((appointment) => {
        const doctorName = appointment.doctor?.username ?? "";
        const patientName = appointment.patient.username;
        const searchTarget =
          viewAs === "admin" ? `${doctorName} ${patientName}` : patientName;
  
        return searchTarget.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [appointments, appointmentsList, searchTerm, viewAs]);
  


    const paginatedAppointments = useMemo(() => {
      const filtered = filteredAppointments();
      return filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    }, [currentPage, filteredAppointments]);
  
    const totalPages = useMemo(() => {
      const filtered = filteredAppointments();
      return Math.ceil(filtered.length / PAGE_SIZE);
    }, [filteredAppointments]);
  
   
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };

  return (
    <div className="space-y-6 mb-16">
      <AppointmentSearch
        translations={translations}
        locale={locale}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewAs={viewAs}
      />
      <div className="block lg:hidden">
        <AppointmentCardList
          appointments={paginatedAppointments}
          translations={translations}
          loadingState={loadingState}
          onConfirm={handleUpdateConfirm}
          onCancel={handleUpdateCancel}
        />
      </div>
      <div className="hidden lg:block">
        <AppointmentTable
          appointments={paginatedAppointments}
          translations={translations}
          loadingState={loadingState}
          onConfirm={handleUpdateConfirm}
          onCancel={handleUpdateCancel}
          viewAs={viewAs}
        />
      </div>
      
    
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
         {locale === Languages.ARABIC ? "السابق" : "Previous"}
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
         {locale === Languages.ARABIC ? "التالي" : "Next"}
        </Button>
      </div>
    </div>
  );
}
