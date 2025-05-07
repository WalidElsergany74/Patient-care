"use client";


import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Translations } from "@/types/Translations";
import { Languages } from "@/constants";
import { Locale } from "@/i18n.config";
import { Loader2 } from "lucide-react";
import Link from "@/components/link";
import Loader from "@/components/ui/Loader";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-400",
  CONFIRMED: "bg-green-500",
  COMPLETED: "bg-blue-500",
  CANCELLED: "bg-red-500",
};


interface AppointmentCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any;
  onDelete?: (id: string) => void;
  isExpired?: boolean;
  isPending: boolean;
  isDeleting?: boolean;
  translations: Translations;
  locale: Locale;
}

export default function AppointmentCard({
  appointment,
  onDelete,
  isExpired,
  isPending,
  isDeleting,
  translations,
  locale,
}: AppointmentCardProps) {
  const dateFnsLocale = locale === "ar" ? ar : enUS;
  const isArabic = locale === Languages.ARABIC;
  const statusLabels: Record<string, { en: string; ar: string }> = {
    PENDING: { en: "Pending", ar: "قيد الانتظار" },
    CONFIRMED: { en: "Confirmed", ar: "تم التأكيد" },
    COMPLETED: { en: "Completed", ar: "مكتمل" },
    CANCELLED: { en: "Cancelled", ar: "تم الإلغاء" },
  };
  
  const translatedStatus =
    statusLabels[appointment.status]?.[locale === "ar" ? "ar" : "en"] ?? appointment.status;

  return (
    <Card
      className={`py-6 px-4 md:px-6 flex gap-6 shadow-md rounded-2xl border transition-all ${
        isExpired ? "opacity-50" : ""
      } ${isDeleting || isPending ? "opacity-50" : ""}`}
    >
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between w-full ">
        <Link className="" href={`${!isExpired ? `/${locale}/doctors/${appointment.doctor.id}` : ""}`} >
        <Image
          src={appointment?.doctor?.image ?? ""}
          alt={appointment?.doctor?.username ?? "Unknown Doctor"}
          width={300}
          height={300}
          className="rounded-full hover:scale-105 transition-all w-[120px] h-[120px] md:w-[150px] md:h-[150px] bg-primary/10 p-1 border-2 border-primary object-cover shadow"
        />
        </Link>

        <CardContent className="flex-1 space-y-4 p-0">
          <h3 className="text-xl md:text-2xl font-bold m-0 text-gray-900">
            {isArabic ? "د. " : "Dr. "}
            {isArabic ? appointment.doctor.username_ar : appointment.doctor.username}
          </h3>

          <div className="flex flex-col gap-2 text-gray-700 text-sm my-2 font-medium">
            <span className="inline-block bg-blue-100 text-blue-700 w-fit text-sm font-medium px-3 py-1 rounded-full">
              {locale === Languages.ARABIC ? appointment.doctor.specialty.name_ar : appointment.doctor?.specialty?.name}
            </span>

            <p className="flex items-center gap-2 mt-2">
              📅 {translations.reservation.Date} :
              <span className="text-gray-900 font-semibold ms-1">
                {format(new Date(appointment.appointmentTime), "dd MMMM yyyy", {
                  locale: dateFnsLocale,
                })}
              </span>
            </p>

            <p className="flex items-center gap-2">
              ⏰ {translations.reservation.Time} :
              <span className="text-gray-900 font-semibold ms-1">
                {format(new Date(appointment.appointmentTime), "hh:mm a", {
                  locale: dateFnsLocale,
                })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span
              className={`w-3 h-3 rounded-full ${statusColors[appointment.status]}`}
            ></span>
            <span className="text-sm  font-semibold capitalize">
            {translatedStatus}
            </span>
          </div>
        </CardContent>

        {!isExpired && onDelete && (
          <Alert
            locale={locale}
            translations={translations}
            isPending={isPending}
            isDeleting={isDeleting}
            appointmentId={appointment.id}
            onDelete={onDelete}
          />
        )}
      </div>
    </Card>
  );
}

interface AlertProps {
  appointmentId: string;
  onDelete: (id: string) => void;
  isPending: boolean;
  isDeleting?: boolean;
  translations: Translations;
  locale: Locale;
}

export function Alert({
  appointmentId,
  onDelete,
  isPending,
  isDeleting,
  translations,
  locale,
}: AlertProps) {
  const isArabic = locale === Languages.ARABIC;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isPending || isDeleting}
          className="border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition text-sm md:text-base"
        >
          {isDeleting && (
            <Loader className="w-4 h-4 animate-spin mr-2" />
          )}
          {isDeleting
            ?
           <>
            <Loader className="w-4 h-4 animate-spin mr-2" />
            {translations.reservation.deleting}
           </>
            : translations.reservation.CancelAppointment}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent
        dir={isArabic ? "rtl" : "ltr"}
        className={isArabic ? "!text-right" : "text-left"}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className={`text-lg md:text-xl font-bold text-gray-800 ${isArabic ? "!text-right" : "text-left"}`}>
            {translations.reservation.areSure}
          </AlertDialogTitle>
          <AlertDialogDescription className={`text-gray-600 text-sm md:text-base ${isArabic ? "!text-right" : "text-left"}`}>
            {translations.reservation.thisAction}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex gap-4">
          <AlertDialogCancel className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm md:text-base">
            {translations.close}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending || isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md text-sm md:text-base flex items-center gap-2"
            onClick={() => onDelete(appointmentId)}
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting
              ? translations.reservation.deleting
              : translations.reservation.CancelAppointment}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
