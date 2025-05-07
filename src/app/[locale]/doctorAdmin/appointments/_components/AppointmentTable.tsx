import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import AppointmentTableRow from "./AppointmentTableRow";
import { Translations } from "@/types/Translations";
import { useParams } from "next/navigation";
import { Languages } from "@/constants";




type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointments: any;
  loadingState: { id: string | null; action: "CONFIRMED" | "CANCEL" | null };
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  translations : Translations,
  viewAs: "doctor" | "admin";
};

export default function AppointmentTable({
  appointments,
  loadingState,
  onConfirm,
  onCancel,
  translations,
 viewAs
}: Props) {
  const {locale} = useParams()
  return (
    <Card className="rounded-3xl shadow-xl border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[90px] text-center font-bold text-primary">#</TableHead>
            <TableHead className="w-[180px] text-center font-bold text-primary">{translations.doctorDashboard.appointmentPage.table.patient}</TableHead>
            <TableHead className="w-[180px] text-center font-bold text-primary">{translations.doctorDashboard.appointmentPage.table.date}</TableHead>
            <TableHead className="w-[180px] text-center font-bold text-primary">{translations.doctorDashboard.appointmentPage.table.time}</TableHead>
            {viewAs === "admin" && (
               <>
     <TableHead className="w-[180px] text-center font-bold text-primary">
      {locale === Languages.ARABIC ? "الدكتور" : "Doctor"}
     </TableHead>

            </>)}
            <TableHead className="w-[180px] text-center font-bold text-primary">{translations.doctorDashboard.appointmentPage.table.fee}</TableHead>
            <TableHead className="w-[180px] text-center font-bold text-primary">{translations.doctorDashboard.appointmentPage.table.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            appointments.map((appointment: any, index: number) => (
              <AppointmentTableRow
                key={appointment.id}
                appointment={appointment}
                index={index}
                translations={translations}
                loadingState={loadingState}
                onConfirm={onConfirm}
                onCancel={onCancel}
                viewAs={viewAs}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                {translations.noBookingFound}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}