"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DoctorWithRelations } from "@/types/doctors";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { bookAppointment } from "@/server/_actions/appintments";
import { Locale } from "@/i18n.config";
import { Languages } from "@/constants";
import { Translations } from "@/types/Translations";
import { useRouter } from "next/navigation";

interface DialogSlotProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  doctor: DoctorWithRelations | null;
  locale : Locale,
  translations : Translations
}

const DialogSlot: React.FC<DialogSlotProps> = ({ open, setOpen, doctor , locale, translations }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const session = useSession();
  const user = session.data?.user;

  
  const availableDays = useMemo(() => {
    if (!doctor?.AvailableTimeSlot) return [];
    return [...new Set(doctor.AvailableTimeSlot.map((slot: { day: string; }) => slot.day.toUpperCase()))];
  }, [doctor?.AvailableTimeSlot]);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !doctor?.AvailableTimeSlot) return [];
    const selectedDay = format(selectedDate, "EEEE").toUpperCase();
    return doctor.AvailableTimeSlot
      .filter((slot: { day: string; }) => slot.day.toUpperCase() === selectedDay)
      .map((slot: { timeSlot: string; }) => slot.timeSlot);
  }, [selectedDate, doctor?.AvailableTimeSlot]);

 
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);


  const isDayAvailable = useCallback(
    (date: Date) => date >= today && availableDays.includes(format(date, "EEEE").toUpperCase()),
    [availableDays, today]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;
    if (!user) return toast.error(translations.messages.mustLogin);
    if (user.role === "DOCTOR") return toast.error(translations.messages.onlyPatient);
    if (!doctor?.id) return toast.error(translations.messages.invalidDoctor);

    setLoading(true);
    try {
      const response = await bookAppointment(selectedDate, selectedTime, user, doctor.id);
      if (response.error) throw new Error(response.error);
      setOpen(false);
      toast.success(translations.messages.bookingSuccess);
      
      setSelectedDate(null);
      setSelectedTime(null);
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || translations.messages.unexpectedError);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTime , user,router, translations.messages.mustLogin, translations.messages.onlyPatient, translations.messages.invalidDoctor, translations.messages.bookingSuccess, translations.messages.unexpectedError, doctor.id, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left text-base md:text-lg">
            {translations.reservation.slot.bookWithDoctor} {locale === Languages.ARABIC ? "د.": "Dr."}  
           {locale === Languages.ARABIC ? doctor.username_ar : doctor.username}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-3">
          <div>
            <h3 className="text-lg font-semibold mb-2">{translations.reservation.slot.selectDay}</h3>
            <Calendar
              onChange={(date) => setSelectedDate(date as Date)}
              value={selectedDate}
              tileDisabled={({ date }) => !isDayAvailable(date)}
              locale={locale === Languages.ARABIC ? "ar" : "en-us"}
              className="rounded-md border border-stone-200 p-2 shadow-sm !w-[300px] !md:w-[350px]"
            />
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-lg font-semibold mt-4">{translations.reservation.slot.selectTime}</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
              {availableSlots.length > 0 ? (
  availableSlots.map((time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const isPM = hours >= 12;
    const suffix =
      locale === Languages.ARABIC
        ? isPM ? "م" : "ص"
        : isPM ? "PM" : "AM";

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${suffix}`;

    return (
      <Button
        key={time}
        variant={selectedTime === time ? "default" : "outline"}
        className={selectedTime === time ? "bg-primary text-white" : ""}
        onClick={() => setSelectedTime(time)}
      >
        {formattedTime}
      </Button>
    );
  })
) : (
  <p className="text-gray-500">{translations.noSlots}</p>
)}
</div>
</div>
)}

        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {translations.close}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedDate || !selectedTime || loading}>
            {loading ? translations.book : translations.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSlot;
