import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Languages } from "@/constants";
import { User } from "lucide-react";
import { useParams } from "next/navigation";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export default function PatientsSearch({ searchTerm, setSearchTerm }: Props) {
  const {locale} = useParams()
   const transPatient = locale === Languages.ARABIC ? "ابحث باسم المريض " : "Search by patient name"
  return (
    <Card className="bg-white border-gray-100 rounded-3xl border-none shadow-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">
         {locale === Languages.ARABIC ? "إدارة المرضي" : "Management Patients"}
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder={transPatient}
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