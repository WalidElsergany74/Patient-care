import { Card } from "@/components/ui/card";
import AppointmentCard from "./AppointmentCard";
import { Translations } from "@/types/Translations";




type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointments: any;
  loadingState: { id: string | null; action: "CONFIRMED" | "CANCEL" | null };
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  translations : Translations,
 
};

export default function AppointmentCardList({
  appointments,
  loadingState,
  onConfirm,
  onCancel,
  translations,
 
}: Props) {
  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appointments.map((appointment : any) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            loadingState={loadingState}
            translations={translations}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        ))
      ) : (
        <Card className="text-center p-8 rounded-2xl shadow-md">
          <p className="text-muted-foreground">No appointments match your search</p>
        </Card>
      )}
    </div>
  );
}