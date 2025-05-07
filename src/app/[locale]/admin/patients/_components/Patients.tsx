'use client';

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { Languages } from "@/constants";
import { Button } from "@/components/ui/button";
import PatientsSearch from "./PatientsSearch";
import { useMemo, useState } from "react";
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
} from "@/components/ui/alert-dialog"
import { Locale } from "@/i18n.config";
import { toast } from "sonner";
import { deletePatient } from "../_actions";


type Patient = {
  id: string;
  username: string;
  age?: number | null;
  gender?: string | null;
  phone?: string | null;
  email: string;
  image?: string | null;
};

type Props = {
  patients: Patient[];
};

export default function PatientsComponent({ patients }: Props) {
  const { locale } = useParams();
  const router = useRouter();
  const [searchTerme , setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const PAGE_SIZE = 10;
  const handleProfileClick = (id: string) => {
    router.push(`/${locale}/admin/patients/${id}/editPatient`); 
  };
  console.log(patients, "ssssssss")



  const getGenderLabel = (gender: string) => {
    if (locale === Languages.ARABIC) {
      if (gender === "Male") return "ذكر";
      if (gender === "Female") return "أنثى";
    } else {
      if (gender === "Male") return "Male";
      if (gender === "Female") return "Female";
    }
    return locale === Languages.ARABIC ? "غير محدد" : "Not specified";
  };
  
  const filteredPatients = patients.filter((patient) =>
    patient.username.toLowerCase().includes(searchTerme.toLowerCase())
  );

  const paginatedPatients = useMemo(() => {
    const filtered = filteredPatients;
    return filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [currentPage, filteredPatients]);

  const totalPages = useMemo(() => {
    const filtered = filteredPatients;
    return Math.ceil(filtered.length / PAGE_SIZE);
  }, [filteredPatients]);

 
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const handleDeletePatient = async (patientId: string) => {
    try {
      setDeletingPatientId(patientId);
      await deletePatient(patientId);
      toast.success(locale === Languages.ARABIC ? "تم حذف المريض بنجاح" : "Patient deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(locale === Languages.ARABIC ? "حدث فشل في حذف هذا المريض" : "Failed to delete this patient");
    } finally {
      setDeletingPatientId(null);
    }
  };
  return (
   <><div className="space-y-8">
      <PatientsSearch searchTerm={searchTerme} setSearchTerm={setSearchTerm} />
      <Card className="rounded-3xl shadow-xl border border-gray-100 hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px] text-center font-bold text-primary">#</TableHead>
              <TableHead className="w-[180px] text-center font-bold text-primary">
                {locale === Languages.ARABIC ? "المريض" : "Patient"}
              </TableHead>
              <TableHead className="w-[180px] text-center font-bold text-primary">
                {locale === Languages.ARABIC ? "العمر" : "Age"}
              </TableHead>
              <TableHead className="w-[180px] text-center font-bold text-primary">
                {locale === Languages.ARABIC ? "النوع" : "Gender"}
              </TableHead>
              <TableHead className="w-[180px] text-center font-bold text-primary">
                {locale === Languages.ARABIC ? "رقم الموبايل" : "Phone"}
              </TableHead>
              <TableHead className="w-[220px] text-center font-bold text-primary">
                {locale === Languages.ARABIC ? "البريد الالكتروني" : "Email"}
              </TableHead>
              <TableHead className="w-[220px] text-center font-bold text-primary">
                {locale === Languages.ARABIC ? "الإجراءات" : "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((patient, index) => (
                <TableRow key={patient.id || patient.username} className="text-center">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-center w-[180px]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={patient.image as string} />
                        <AvatarFallback>
                          {patient.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{patient.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.age ? patient.age : locale === Languages.ARABIC ? "غير محدد" : "Not specified"}
                  </TableCell>
                  <TableCell>
                    {getGenderLabel(patient.gender as string)}

                  </TableCell>
                  <TableCell>
                    {patient.phone ? patient.phone : locale === Languages.ARABIC ? "غير محدد" : "Not specified"}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                    <AlertDialogDemo
           patientId={patient.id}
          deletingPatientId={deletingPatientId}
           onDelete={handleDeletePatient}
          locale={locale}
                        />
                      <Button
                        className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
                        onClick={() => handleProfileClick(patient.id)}
                      >
                        {locale === Languages.ARABIC ? "عرض الملف" : "View Profile"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : [
              <TableRow key="noPatients">
                <TableCell colSpan={7} className="text-center h-24">
                  {locale === Languages.ARABIC ? "لا يوجد مرضى" : "No patients found."}
                </TableCell>
              </TableRow>,
            ]}
          </TableBody>
        </Table>
      </Card>

    </div>
   
     

      
        <div className="flex flex-col gap-4 lg:hidden mb-20 md:mb-0">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Card key={patient.id || patient.username} className="p-4 shadow-md border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.image as string} />
                    <AvatarFallback>
                      {patient.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{patient.username}</h3>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">{locale === Languages.ARABIC ? "العمر:" : "Age:"}</span>{" "}
                    {patient.age ?? (locale === Languages.ARABIC ? "غير محدد" : "Not specified")}
                  </p>
                  <p>
                    <span className="font-medium">{locale === Languages.ARABIC ? "النوع:" : "Gender:"}</span>{" "}
                    {getGenderLabel(patient.gender as string)}
                  </p>
                  <p>
                    <span className="font-medium">{locale === Languages.ARABIC ? "رقم الموبايل:" : "Phone:"}</span>{" "}
                    {patient.phone ?? (locale === Languages.ARABIC ? "غير محدد" : "Not specified")}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                <AlertDialogDemo
  patientId={patient.id}
  deletingPatientId={deletingPatientId}
  onDelete={handleDeletePatient}
  locale={locale}
/>
                  <Button
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                    onClick={() => handleProfileClick(patient.id)}
                  >
                    {locale === Languages.ARABIC ? "عرض الملف" : "View Profile"}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">
              {locale === Languages.ARABIC ? "لا يوجد مرضى" : "No patients found."}
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
         {locale === Languages.ARABIC ? "السابق" : "Previous"}
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
         {locale === Languages.ARABIC ? "التالي" : "Next"}
        </Button>
      </div>
     
     </>
  );
}

export function AlertDialogDemo({
  locale,
  onDelete,
  patientId,
  deletingPatientId,
}: {
  locale: Locale;
  onDelete: (patientId: string) => void;
  patientId: string;
  deletingPatientId: string | null;
}) {
  const isDeleting = deletingPatientId === patientId;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isDeleting}
          className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-100"
        >
          {isDeleting ? (locale === Languages.ARABIC ? "جاري الحذف..." : "Deleting...") :
            (locale === Languages.ARABIC ? "حذف" : "Delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
        <AlertDialogHeader className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
          <AlertDialogTitle className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
            {locale === Languages.ARABIC ? "هل أنت متأكد؟" : "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
            {locale === Languages.ARABIC
              ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف بيانات هذا المريض بشكل دائم."
              : "This action cannot be undone. This will permanently delete this patient's data."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {locale === Languages.ARABIC ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(patientId)}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-800"
          >
            {locale === Languages.ARABIC ? "تأكيد الحذف" : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


