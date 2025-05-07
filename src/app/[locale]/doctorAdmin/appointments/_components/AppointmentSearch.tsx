import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Languages } from "@/constants";
import { Locale } from "@/i18n.config";
import { Translations } from "@/types/Translations";
import { User } from "lucide-react";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  translations : Translations,
  locale : Locale
  viewAs  : "admin" | "doctor"
};

export default function AppointmentSearch({ searchTerm, setSearchTerm , translations, locale,viewAs}: Props) {
   const transAdmin = locale === Languages.ARABIC ? "ابحث باسم المريض أو الدكتور" : "Search by patient or doctor name"
  return (
    <Card className="bg-white border-gray-100 rounded-3xl border-none shadow-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">
         {translations.doctorDashboard.appointmentPage.title}
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder={
                viewAs === "doctor" ? translations.doctorDashboard.appointmentPage.label : transAdmin
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 border-muted shadow-sm focus:ring-2 focus:ring-primary rounded-lg"
            />
            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}