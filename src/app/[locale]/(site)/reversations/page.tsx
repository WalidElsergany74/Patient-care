import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { getAppointments } from "@/server/db/appointments";
import { isBefore } from "date-fns";
import AppointmentList from "./_components/AppointmentList";
import { addMinutes, isAfter } from 'date-fns';
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";
import { Languages } from "@/constants";
import { authOptions } from "@/server/auth";

export default async function MyBooking() {
 const session = await getServerSession(authOptions);
  const appointments = await getAppointments(session?.user.id);
     const locale = await getCurrentLocale()
     const translations = await getTrans(locale)
  const currentDate = new Date();

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      isBefore(currentDate, new Date(appointment.appointmentTime)) && appointment.status !== "CANCELLED"
  );
  

  const expiredAppointments = appointments.filter((appointment) => {
    
    if (appointment.status !== "PENDING" && appointment.status !== "CANCELLED" && appointment.status !== "CONFIRMED") {
      console.log(`Skipping appointment ${appointment.id} because status is ${appointment.status}`);
      return false;
    }
  
    const appointmentDate = new Date(appointment.appointmentTime);
    const appointmentWithGracePeriod = addMinutes(appointmentDate, 30);
    
    const currentDate = new Date(); 
    console.log(`Current Time: ${currentDate}`);
  
   
    const isExpired = isAfter(currentDate, appointmentWithGracePeriod);
    console.log(`Is Expired: ${isExpired}`);
  
    
    return isExpired || appointment.status === "CANCELLED" || appointment.status === "CONFIRMED";
  });
  
  
  
  

  return (
    <section className="py-6 container max-w-6xl mx-auto  px-3 lg:px-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations.reservation.myBooking}</h2>

      <Tabs dir={locale === Languages.ARABIC ? "rtl" : "ltr"} defaultValue="upcoming" className="w-full mt-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg flex">
          <TabsTrigger value="upcoming" className="flex-1">{translations.reservation.upcoming}</TabsTrigger>
          <TabsTrigger value="expired" className="flex-1">{translations.reservation.expired}</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <AppointmentList locale={locale} translations={translations} appointments={upcomingAppointments} />
        </TabsContent>

        <TabsContent value="expired">
          <AppointmentList locale={locale} translations={translations} appointments={expiredAppointments} isExpired />
        </TabsContent>
      </Tabs>
    </section>
  );
}
