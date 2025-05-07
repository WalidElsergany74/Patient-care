import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Translations } from "@/types/Translations";
import { Languages } from "@/constants";
import { useParams } from "next/navigation";


type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any;
  index: number;
  loadingState: { id: string | null; action: "CONFIRMED" | "CANCEL" | null };
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  translations : Translations,
  viewAs: "doctor" | "admin";
};

export default function AppointmentTableRow({
  appointment,
  index,
  loadingState,
  onConfirm,
  onCancel,
  translations,
 viewAs
  
}: Props) {
    const {locale} = useParams()
      const statusLabels: Record<string, { en: string; ar: string }> = {
      PENDING: { en: "Pending", ar: "قيد الانتظار" },
      CONFIRMED: { en: "Confirmed", ar: "تم التأكيد" },
      COMPLETED: { en: "Completed", ar: "مكتمل" },
      CANCELLED: { en: "Cancelled", ar: "تم الإلغاء" },
    };
    
    const translatedStatus =
      statusLabels[appointment.status]?.[locale === "ar" ? "ar" : "en"] ?? appointment.status;
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
    <TableRow className="text-center">
      <TableCell>{index + 1}</TableCell>
      <TableCell className="w-[180px] text-left">
        <div className="flex items-center gap-3 ">
          <Avatar className="h-9 w-9">
            <AvatarImage src={appointment.patient.image as string} />
            <AvatarFallback>
              {appointment.patient.username
                .split(" ")
                .map((n :  string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span>{appointment.patient.username}</span>
        </div>
      </TableCell>
      <TableCell className="w-[180px] text-center">
        {format(appointment.appointmentTime, "EEEE, d MMM yyyy", {locale : locale === Languages.ARABIC ? ar : enUS})}
      </TableCell>
      <TableCell className="w-[180px] text-center">
        {format(appointment.appointmentTime, "hh:mm a", {locale : locale === Languages.ARABIC ? ar : enUS})}
      </TableCell>
      {viewAs === "admin" && (
         <TableCell className="w-[180px] text-left">
         <div className="flex items-center gap-3 ">
           <Avatar className="h-9 w-9">
             <AvatarImage src={appointment.doctor.image as string} />
             <AvatarFallback>
               {appointment.doctor.username
                 .split(" ")
                 .map((n :  string) => n[0])
                 .join("")}
             </AvatarFallback>
           </Avatar>
           <span>{locale === Languages.ENGLISH ? appointment.doctor.username : appointment.doctor.username_ar}</span>
         </div>
       </TableCell>
      )}
      <TableCell className="w-[180px] text-center font-bold text-green-600">
        {appointment.doctor.price} {translations.home.doctorSection.doctorCard.CURRENCY}
      </TableCell>
      <TableCell className="w-[180px] text-center">
        {appointment.status === "PENDING" ? (
          <div className="flex gap-2 justify-center">
            <Button
              disabled={loadingState.id === appointment.id && loadingState.action === "CANCEL"}
              variant="outline"
              className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-100"
              onClick={() => onCancel(appointment.id)}
            >
              {loadingState.id === appointment.id && loadingState.action === "CANCEL" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {translations.cancel}
            </Button>
            <Button
              disabled={loadingState.id === appointment.id && loadingState.action === "CONFIRMED"}
              className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => onConfirm(appointment.id)}
            >
              {loadingState.id === appointment.id && loadingState.action === "CONFIRMED" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {translations.submit}
            </Button>
          </div>
        ) : (
          getStatusBadge(appointment.status)
        )}
      </TableCell>
    </TableRow>
  );
}