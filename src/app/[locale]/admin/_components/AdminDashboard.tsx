"use client";
import { Chart } from "chart.js";
import {
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, Stethoscope, ArrowUp, ArrowDown } from "lucide-react";
import { useParams } from "next/navigation";
import { AppointmentsWithRelations, DoctorWithRelations } from "@/types/doctors";
import { Bar, Doughnut } from "react-chartjs-2";



interface Patient {
  createdAt: string | number | Date;
  id: string;
  username: string;
  image: string | null;
}

interface AdminDashboardProps {
  appointments: AppointmentsWithRelations[];
  doctors: DoctorWithRelations[];
  patients: Patient[];
}

const statusConfig = {
  CONFIRMED: {
    color: "bg-blue-100 text-blue-800",
    ar: "مؤكد",
    en: "Confirmed",
    chartColor: "#3b82f6",
  },
  PENDING: {
    color: "bg-amber-100 text-amber-800",
    ar: "قيد الانتظار",
    en: "Pending",
    chartColor: "#f59e0b",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800",
    ar: "ملغي",
    en: "Cancelled",
    chartColor: "#ef4444",
  },
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  doctors,
  patients,
}) => {
  const { locale } = useParams();
  const isArabic = locale === "ar";
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;

  // حساب الإيرادات الإجمالية للشهر الحالي
  const totalRevenue = appointments
    .filter((appt) => appt.status === "CONFIRMED")
    .reduce((sum, appt) => sum + (appt.doctor?.price || 0), 0);

  // حساب الإيرادات للشهر السابق
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthRevenue = appointments
    .filter((appt) => {
      const createdAt = new Date(appt.createdAt);
      return (
        createdAt.getMonth() === lastMonth.getMonth() &&
        createdAt.getFullYear() === lastMonth.getFullYear() &&
        appt.status === "CONFIRMED"
      );
    })
    .reduce((sum, appt) => sum + (appt.doctor?.price || 0), 0);

  // حساب النسبة المئوية للزيادة في الإيرادات
  const revenueGrowthPercentage =
    lastMonthRevenue === 0
      ? 0
      : ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // حساب المرضى الجدد لهذا الشهر
  const newPatientsThisMonth = patients.filter((patient) => {
    const createdAt = new Date(patient.createdAt);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  }).length;

  // حساب المواعيد الجديدة لهذا الشهر
  const newAppointmentsThisMonth = appointments.filter((appointment) => {
    const createdAt = new Date(appointment.createdAt);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  }).length;

  // حساب الحالة الإجمالية للمواعيد
  const totalAppointments = appointments.length;
  const appointmentStats = {
    CONFIRMED: appointments.filter((appt) => appt.status === "CONFIRMED").length,
    PENDING: appointments.filter((appt) => appt.status === "PENDING").length,
    CANCELLED: appointments.filter((appt) => appt.status === "CANCELLED").length,
  };

  // حساب الإيرادات الجديدة لهذا الشهر
  const newRevenueThisMonth = appointments
    .filter((appt) => {
      const createdAt = new Date(appt.createdAt);
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear &&
        appt.status === "CONFIRMED"
      );
    })
    .reduce((sum, appt) => sum + (appt.doctor?.price || 0), 0);

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
    cutout: "50%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const revenueChartData = {
    labels: [
      isArabic ? "الشهر السابق" : "Previous Month",
      isArabic ? "الشهر الحالي" : "Current Month",
    ],
    datasets: [
      {
        label: isArabic ? "الإيرادات (جنيه مصري)" : "Revenue (EGP)",
        data: [lastMonthRevenue, totalRevenue],
        backgroundColor: ["#93C5FD", "#3B82F6"],
        borderColor: ["#2563EB"],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString();
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return context.raw.toLocaleString() + " ج.م";
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen mb-16 md:mb-0 p-2 ">
      <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-4 gap-6 ">
        {/* Patients Card */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">
              {isArabic ? "المرضى" : "Patients"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{totalPatients}</p>
            <div className="flex items-center text-sm mt-2">
              {newPatientsThisMonth > 0 ? (
                <>
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    {isArabic
                      ? `+${newPatientsThisMonth} هذا الشهر`
                      : `+${newPatientsThisMonth} this month`}
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">
                    {isArabic ? `لا يوجد مرضى جدد` : `No new patients`}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctors Card */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">
              {isArabic ? "الأطباء" : "Doctors"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{totalDoctors}</p>
            <div className="flex items-center text-sm mt-2">
              <span className="text-gray-500">
                {isArabic ? "متاحين للاستشارة" : "Available for consultation"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Card */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">
              {isArabic ? "المواعيد" : "Appointments"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{totalAppointments}</p>
            <div className="flex items-center text-sm mt-2">
              {newAppointmentsThisMonth > 0 ? (
                <>
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    {isArabic
                      ? `+${newAppointmentsThisMonth} هذا الشهر`
                      : `+${newAppointmentsThisMonth} this month`}
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">
                    {isArabic ? `لا يوجد مواعيد جديدة` : `No new appointments`}
                  </span>
                </>
              )}
            </div>
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

        {/* Revenue Card */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">
              {isArabic ? "الإيرادات" : "Revenue"}
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">
              {totalRevenue.toLocaleString()} {isArabic ? "ج.م" : "EGP"}
            </p>
            <div className="flex items-center text-sm mt-2">
              {newRevenueThisMonth > 0 ? (
                <>
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    {isArabic
                      ? `+${newRevenueThisMonth.toLocaleString()} هذا الشهر`
                      : `+${newRevenueThisMonth.toLocaleString()} this month`}
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">
                    {isArabic ? `لا يوجد إيرادات جديدة` : `No new revenue`}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center text-sm mt-2">
              {revenueGrowthPercentage >= 0 ? (
                <>
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    {isArabic
                      ? `+${Math.abs(revenueGrowthPercentage).toFixed(1)}% عن الشهر الماضي`
                      : `+${Math.abs(revenueGrowthPercentage).toFixed(1)}% from last month`}
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">
                    {isArabic
                      ? `-${Math.abs(revenueGrowthPercentage).toFixed(1)}% عن الشهر الماضي`
                      : `-${Math.abs(revenueGrowthPercentage).toFixed(1)}% from last month`}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointments Distribution Chart */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow col-span-1 sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {isArabic ? "توزيع المواعيد" : "Appointments Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-64 h-64">
              <Doughnut data={appointmentChartData} options={appointmentChartOptions} />
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center gap-1">
                  <span
                    className="block w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.chartColor }}
                  ></span>
                  <span>
                    {isArabic ? config.ar : config.en} ({appointmentStats[status as keyof typeof appointmentStats]})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow col-span-1 sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {isArabic ? "الإيرادات الشهرية" : "Monthly Revenue"}
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full h-80">
            <Bar data={revenueChartData} options={revenueChartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;