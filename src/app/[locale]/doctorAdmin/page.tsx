
import React from "react";
import DoctorDashboard from "./_components/DoctorDashboard";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";
import { getAppointmentsDoctors } from "@/server/db/appointments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

const DoctorDashboardPage = async () => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  const doctorId = session?.user.id;
  const appointments = await getAppointmentsDoctors(doctorId as string);

  return (
    <DoctorDashboard translations={translations}  appointments={appointments} />
  );
};

export default DoctorDashboardPage;
