"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Plus, Trash2, Clock } from "lucide-react";
import { AvailableTimeSlot, WeekDay } from "@prisma/client";
import { useRouter } from "next/navigation";
import { addSlot, deleteSlot } from "../_actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ar, enUS } from "date-fns/locale";
import { Languages } from "@/constants";
import { format, parse } from "date-fns";
import { DialogTitle } from "@radix-ui/react-dialog";

const daysMap = {
  ar: {
    SATURDAY: "السبت",
    SUNDAY: "الأحد",
    MONDAY: "الاثنين",
    TUESDAY: "الثلاثاء",
    WEDNESDAY: "الأربعاء",
    THURSDAY: "الخميس",
    FRIDAY: "الجمعة",
  },
  en: {
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
  },
};

export default function AvailabilitySimple({
  slots,
}: {
  slots: AvailableTimeSlot[];
}) {
  const [selectedDay, setSelectedDay] = useState("");
  const [time, setTime] = useState("");
  const params = useParams();
  const locale = params.locale as keyof typeof daysMap;
  const router = useRouter();
  const session = useSession();
  const doctorId = session.data?.user.id;

  const translatedDays = Object.values(daysMap[locale]);

  const getWeekDay = (translatedDay: string): WeekDay => {
    const dayEntry = Object.entries(daysMap[locale]).find(
      ([, value]) => value === translatedDay
    );
    return dayEntry ? (dayEntry[0] as WeekDay) : "SATURDAY";
  };

  const handleAddSlot = async () => {
    if (!time || !selectedDay) {
      toast.info(locale === "ar" ? "يرجى إدخال الوقت" : "Please enter a time");
      return;
    }

    if (!doctorId) {
      toast.error(locale === "ar" ? "يرجى تسجيل الدخول" : "Please log in");
      return;
    }

    const weekDay = getWeekDay(selectedDay);

    try {
      const result = await addSlot(doctorId, weekDay, time);

      if (result.success) {
        setTime("");
        router.refresh();
        toast.success(
          locale === "ar" ? "تم إضافة الميعاد بنجاح" : "Slot added successfully"
        );
      } else {
        toast.error(
          result.message ||
            (locale === "ar" ? "فشل في الإضافة" : "Failed to add slot")
        );
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
    }
  };
  const handleDeleteSlot = async (day: WeekDay, timeSlot: string) => {
    if (!doctorId) {
      toast.error(locale === "ar" ? "يرجى تسجيل الدخول" : "Please log in");
      return;
    }

    try {
      const result = await deleteSlot(doctorId, day, timeSlot);

      if (result.success) {
        router.refresh();
        toast.success(
          locale === "ar" ? "تم حذف الميعاد بنجاح" : "Slot deleted successfully"
        );
      } else {
        toast.error(
          result.message ||
            (locale === "ar" ? "فشل في الحذف" : "Failed to delete slot")
        );
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    try {
      const parsedTime = parse(timeSlot, "HH:mm", new Date());
      if (isNaN(parsedTime.getTime())) {
        return timeSlot;
      }
      return format(parsedTime, "hh:mm a", {
        locale: locale === Languages.ARABIC ? ar : enUS,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeSlot;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
      {translatedDays.map((day) => {
        const slotsForDay = slots.filter(
          (slot) => daysMap[locale][slot.day] === day
        );

        return (
          <Card key={day} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">
                  {day}
                  <span className="text-sm text-gray-500">
                    ( {slotsForDay.length}
                    {locale === "ar" ? "مواعيد متاحة للمرضي" : "slots"} )
                  </span>
                </h2>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedDay(day)}
                      className="hover:bg-gray-100"
                    >
                      <Plus className="w-5 h-5 text-green-500" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>
                      {locale === "ar" ? "إضافة ساعة" : "Add slot"}
                    </DialogTitle>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="border-gray-300 focus:border-blue-500"
                      />
                      <Button
                        onClick={handleAddSlot}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        {locale === "ar" ? "إضافة" : "Add"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {slotsForDay.length > 0 ? (
                  slotsForDay.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          {formatTimeSlot(t.timeSlot)}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-100"
                        onClick={() => handleDeleteSlot(t.day, t.timeSlot)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    {locale === "ar" ? "لا يوجد ساعات" : "No time slots"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
