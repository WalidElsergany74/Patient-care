import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Calendar, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Translations } from "@/types/Translations";
import { useParams } from "next/navigation";
import { Languages } from "@/constants";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any;
  loadingState: { id: string | null; action: "CONFIRMED" | "CANCEL" | null };
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  translations: Translations;
};

export default function AppointmentCard({
  appointment,
  loadingState,
  onConfirm,
  onCancel,
  translations,
}: Props) {
  const { locale } = useParams();

  const statusLabels: Record<string, { en: string; ar: string }> = {
    PENDING: { en: "Pending", ar: "قيد الانتظار" },
    CONFIRMED: { en: "Confirmed", ar: "تم التأكيد" },
    COMPLETED: { en: "Completed", ar: "مكتمل" },
    CANCELLED: { en: "Cancelled", ar: "تم الإلغاء" },
  };

  const translatedStatus =
    statusLabels[appointment.status]?.[locale === "ar" ? "ar" : "en"] ??
    appointment.status;

  const getStatusBadge = (status: string) => {
    const badgeColor =
      status === "CONFIRMED"
        ? "bg-primary/10 text-primary"
        : status === "CANCELLED"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-800";

    return <Badge className={badgeColor}>{translatedStatus}</Badge>;
  };

  return (
    <Card className="rounded-xl shadow-md border border-muted">
      <CardContent className="p-4 space-y-4">
        {/* بيانات المريض والدكتور */}
        <div className="flex justify-between items-center gap-4">
          {/* المريض */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.patient.image as string} />
              <AvatarFallback>
                {appointment.patient.username
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.patient.username}</p>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          {/* الدكتور */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.doctor.image as string} />
              <AvatarFallback>
                {appointment.doctor.username
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-medium">{locale === Languages.ARABIC ? appointment.doctor.username_ar : appointment.doctor.username}</p>
              <p className="text-green-600 font-bold">
                {appointment.doctor.price}{locale === Languages.ARABIC ? "ج.م" : "EGP"}
                
              </p>
            </div>
          </div>
        </div>

  
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {format(appointment.appointmentTime, "d MMM yyyy", {
                locale: locale === Languages.ARABIC ? ar : enUS,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {format(appointment.appointmentTime, "hh:mm a", {
                locale: locale === Languages.ARABIC ? ar : enUS,
              })}
            </span>
          </div>
        </div>

      
        {appointment.status === "PENDING" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-100"
              onClick={() => onCancel(appointment.id)}
              disabled={
                loadingState.id === appointment.id &&
                loadingState.action === "CANCEL"
              }
            >
              {loadingState.id === appointment.id &&
              loadingState.action === "CANCEL" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {translations.cancel}
            </Button>
            <Button
              className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => onConfirm(appointment.id)}
              disabled={
                loadingState.id === appointment.id &&
                loadingState.action === "CONFIRMED"
              }
            >
              {loadingState.id === appointment.id &&
              loadingState.action === "CONFIRMED" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {translations.submit}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
