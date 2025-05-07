/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Calendar, ArrowUp } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Translations } from "@/types/Translations";
import { parse, isSameMonth, subMonths } from "date-fns";

import { LanguageType } from "@/i18n.config";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import AppointmentsDoctor from "../appointments/_components/ApoointmentsDoctor";
// import { Appointment } from "@prisma/client";
import { AppointmentsWithRelations } from "@/types/doctors";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// interface Appointment {
//   id: string;
//   time: string | null;
//   status: "CONFIRMED" | "PENDING" | "CANCELLED";
//   patientName: string;
//   price: number;
//   doctor: {
//     id: string;
//     name: string;
//     price: number;
//   };
//   patient: {
//     id: string;
//     name: string;
//     image: string;
//     username: string;
//   };
// }
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


interface DashboardProps {
  translations: Translations;
  appointments: Appointment[];
}

const statusConfig = {
  CONFIRMED: {
    color: "bg-blue-100 text-blue-800",
    ar: "مؤكد",
    en: "Confirmed",
    chartColor: "#3668f1",
  },
  PENDING: {
    color: "bg-yellow-100 text-yellow-800",
    ar: "قيد الانتظار",
    en: "Pending",
    chartColor: "#FBBF24",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800",
    ar: "ملغي",
    en: "Cancelled",
    chartColor: "#ff6767",
  },
};

const DoctorDashboard = ({ translations, appointments }: DashboardProps) => {
  
  const { locale } = useParams();
  const isArabic = locale === "ar";

  const currentDate = new Date();
  const previousMonth = subMonths(currentDate, 1);

  const parsedAppointments = appointments.map((appt) => {
    let parsedTime: Date;
    try {
      if (appt.appointmentTime && typeof appt.appointmentTime === "string") {
        parsedTime = parse(appt.appointmentTime, "yyyy-MM-dd HH:mm", new Date());
        if (isNaN(parsedTime.getTime())) {
          console.warn(`Invalid time format for appointment ${appt.id}: ${appt.appointmentTime}`);
          parsedTime = currentDate;
        }
      } else {
        console.warn(`Missing or invalid time for appointment ${appt.id}: ${appt.appointmentTime}`);
        parsedTime = currentDate;
      }
    } catch (error) {
      console.error(`Error parsing time for appointment ${appt.id}:`, error);
      parsedTime = currentDate;
    }
    return {
      ...appt,
      parsedTime,
    };
  });

  const currentMonthPatients = new Set(
    parsedAppointments
      .filter((appt) => appt.status === "CONFIRMED" && isSameMonth(appt.parsedTime, currentDate))
      .map((appt) => appt.patient.username)
  ).size;

  const currentMonthRevenue = parsedAppointments
    .filter((appt) => appt.status === "CONFIRMED" && isSameMonth(appt.parsedTime, currentDate))
    .reduce((sum, appt) => sum + (appt.doctor?.price || 0), 0);

  const previousMonthRevenue = parsedAppointments
    .filter((appt) => appt.status === "CONFIRMED" && isSameMonth(appt.parsedTime, previousMonth))
    .reduce((sum, appt) => sum + (appt.doctor?.price || 0), 0);

  const revenueGrowthPercentage =
    previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : currentMonthRevenue > 0
      ? 100
      : 0;

  const patientsCount = new Set(
    parsedAppointments
      .filter((appt) => appt.status === "CONFIRMED")
      .map((appt) => appt.patient.username)
  ).size;
  const revenue = parsedAppointments
    .filter((appt) => appt.status === "CONFIRMED")
    .reduce((sum, appt) => sum + (appt.doctor?.price || 0), 0);
  const totalAppointments = appointments.length;
  const appointmentStats = {
    CONFIRMED: appointments.filter((appt) => appt.status === "CONFIRMED").length,
    PENDING: appointments.filter((appt) => appt.status === "PENDING").length,
    CANCELLED: appointments.filter((appt) => appt.status === "CANCELLED").length,
  };

  
  const appointmentChartData = {
    labels: Object.keys(appointmentStats).map((status) =>
      isArabic
        ? statusConfig[status as keyof typeof statusConfig].ar
        : statusConfig[status as keyof typeof statusConfig].en
    ),
    datasets: [
      {
        data: Object.values(appointmentStats),
        backgroundColor: Object.keys(appointmentStats).map(
          (status) => statusConfig[status as keyof typeof statusConfig].chartColor
        ),
        borderColor: ["#ffffff"],
        borderWidth: 2,
      },
    ],
  };

const appointmentChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "50%", // حجم الفتحة وسط الدائرة
  plugins: {
    legend: {
      display: false, // أخفينا الليجند لأنه موجود تحت
    },
  },
};

  // بيانات مخطط الإيرادات (Bar Chart)
  const revenueChartData = {
    labels: [
      isArabic ? "الشهر السابق" : "Previous Month",
      isArabic ? "الشهر الحالي" : "Current Month",
    ],
    datasets: [
      {
        label: isArabic ? "الإيرادات (جنيه مصري)" : "Revenue (EGP)",
        data: [previousMonthRevenue, currentMonthRevenue],
        backgroundColor: ["#3B82F6", "#2563EB"],
        borderColor: ["#1D4ED8"],
        borderWidth: 1,
        borderRadius: 8,
        
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
          },
          color: "#4B5563",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toLocaleString()} ${isArabic ? "جنيه مصري" : "EGP"}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "#6B7280",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (value: any) => `${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="min-h-screen  px-3">
      

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Patients Card */}
        <Card className="border  border-gray-200 rounded-xl h-52 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isArabic ? "المرضى" : "Patients"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{patientsCount}</div>
            <div className="flex items-center text-xs text-gray-500 mt-4">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span>
                {isArabic
                  ? `+${currentMonthPatients} هذا الشهر`
                  : `+${currentMonthPatients} this month`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card className="border h-52 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isArabic ? "الإيرادات" : "Revenue"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {revenue.toLocaleString()} {isArabic ? "ج.م" : "EGP"}
            </div>
            <div className="flex items-center  text-xs text-gray-500 mt-4">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span>
                {isArabic
                  ? `+${revenueGrowthPercentage.toFixed(1)}% عن الشهر الماضي`
                  : `+${revenueGrowthPercentage.toFixed(1)}% from last month`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Card */}
        <Card className="border h-52 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isArabic ? "المواعيد" : "Appointments"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{totalAppointments}</div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {Object.entries(appointmentStats).map(([status, count]) => (
                <div key={status} className="text-center  ">
                  <p className="text-xs text-gray-500">
                    {isArabic
                      ? statusConfig[status as keyof typeof statusConfig].ar
                      : statusConfig[status as keyof typeof statusConfig].en}
                  </p>
                  <p
                    className={`text-sm font-medium rounded-md px-2 py-1 mt-2 ${
                      statusConfig[status as keyof typeof statusConfig].color
                    }`}
                  >
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-6">
  {/* Appointments Distribution Chart */}
  <Card className="bg-white shadow-md rounded-xl p-4 w-full mx-auto col-span-4 md:col-span-3">
    <h2 className="text-center text-lg font-semibold mb-4">{isArabic ? "توزيع المواعيد" : "Appointments Distribution"}</h2>

    <div className="relative w-52 h-52 mx-auto">
      <Doughnut data={appointmentChartData} options={appointmentChartOptions} />
    </div>

    <div className="flex justify-center gap-4 mt-6 text-sm">
      <div className="flex items-center gap-1">
        <span className="block w-3 h-3 rounded-full bg-blue-600"></span>
        <span>{isArabic ? "مؤكد" : "Confirmed"}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="block w-3 h-3 rounded-full bg-yellow-400"></span>
        <span>{isArabic ? "قيد الانتظار" : "Pending"}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="block w-3 h-3 rounded-full bg-red-500"></span>
        <span>{isArabic ? "ملغي" : "Cancelled"}</span>
      </div>
    </div>
  </Card>

  {/* Monthly Revenue Chart */}
  <Card className="border border-gray-200 h-96 rounded-xl shadow-sm hover:shadow-md transition-shadow col-span-4 md:col-span-5">
    <CardHeader className="px-4 mb-2">
      <CardTitle className="text-lg font-semibold text-gray-800">
        {isArabic ? "الإيرادات الشهرية" : "Monthly Revenue"}
      </CardTitle>
    </CardHeader>
    <CardContent className="w-full h-72 !px-2">
      <Bar data={revenueChartData} options={revenueChartOptions} />
    </CardContent>
  </Card>
</div>


  
      
       
       
          <AppointmentsDoctor
            appointments={appointments}
            translations={translations}
            locale={locale as LanguageType}
            viewAs="doctor"
          />
       
    </div>
  );
};

export default DoctorDashboard;