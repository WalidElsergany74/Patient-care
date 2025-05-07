'use client';

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { Languages } from "@/constants";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { Locale } from "@/i18n.config";
import { toast } from "sonner";
import { DoctorWithRelations } from "@/types/doctors";
import { deleteDoctors, updateDoctorAvailability } from "../_actions";
import DoctorSearch from "./DoctorSearch";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

type Props = {
  doctors: DoctorWithRelations[];
};

export default function DoctorsComponent({ doctors }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localDoctors, setLocalDoctors] = useState(doctors);
  const { locale } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);
  const PAGE_SIZE = 10;
  const primaryColor = '#2B6CB0';

  const handleProfileClick = (doctorId: string) => {
    router.push(`/${locale}/doctors/${doctorId}`);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      setDeletingDoctorId(doctorId);
      await deleteDoctors(doctorId);
      router.refresh();
      toast.success(locale === Languages.ARABIC ? "تم حذف الدكتور بنجاح" : "Doctor deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(locale === Languages.ARABIC ? "حدث فشل في حذف هذا الدكتور" : "Failed to delete this doctor");
    } finally {
      setDeletingDoctorId(null);
    }
  };

  const updateSwitch = async (id: string, availability: boolean) => {
    try {
      const newAvailability = !availability;
      await updateDoctorAvailability(id, newAvailability);
      setLocalDoctors((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, availability: newAvailability } : doc
        )
      );
      toast.success(locale === Languages.ARABIC ? "تم تعديل حالة الدكتور بنجاح" : "Doctor updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(locale === Languages.ARABIC ? "حدث فشل في تعديل حالة هذا الدكتور" : "Failed to update status this doctor");
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDoctors = useMemo(() => {
    return filteredDoctors.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [currentPage, filteredDoctors]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredDoctors.length / PAGE_SIZE);
  }, [filteredDoctors]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen space-y-8 mb-16 md:mb-0">
          <DoctorSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="">
        
      

        <Button onClick={() => router.push(`/${locale}/admin/doctors/addDoctor`)}  className="mb-6 !text-white">
          <Plus size={18} className="!text-white "/>
          {locale === Languages.ARABIC ? "اضافة دكتور" : "Add Doctor"}
          </Button>
        <div className="hidden lg:block">
          <Card className="rounded-3xl shadow-xl border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    #
                  </TableHead>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    {locale === Languages.ARABIC ? "الاسم" : "Name"}
                  </TableHead>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    {locale === Languages.ARABIC ? "الصورة" : "Image"}
                  </TableHead>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    {locale === Languages.ARABIC ? "التخصص" : "Specialty"}
                  </TableHead>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    {locale === Languages.ARABIC ? "البريد الالكتروني" : "Email"}
                  </TableHead>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    {locale === Languages.ARABIC ? "متاح / غير متاح" : "Availability"}
                  </TableHead>
                  <TableHead className="w-[180px] text-center font-bold" style={{ color: primaryColor }}>
                    {locale === Languages.ARABIC ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDoctors.length > 0 ? (
                  paginatedDoctors.map((doctor, index) => (
                    <TableRow key={doctor.id || doctor.username} className="text-center">
                      <TableCell className="w-[180px] text-center">{index + 1 + (currentPage - 1) * PAGE_SIZE}</TableCell>
                      <TableCell className="!text-center w-[180px]">
                        <div className="flex items-center justify-center gap-3">
                          <span>{doctor.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="!text-center w-[180px]">
                      <Avatar className="h-9 w-9 mx-auto ">
                            <AvatarImage src={doctor.image ?? undefined} />
                            <AvatarFallback>
                              {doctor.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                      </TableCell>
                      <TableCell className="w-[180px] text-center ">
                        <p className="bg-primary/70 text-white px-2 py-1 rounded-full w-fit mx-auto">
                          {locale === Languages.ARABIC ? doctor.specialty.name_ar : doctor.specialty.name}
                        </p>
                      </TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>
                        <Switch
                          checked={doctor.availability}
                          onCheckedChange={() => updateSwitch(doctor.id, doctor.availability)}
                          className={locale === Languages.ARABIC ? "text-right" : "text-left"}
                        />
                      </TableCell>
                      <TableCell className="w-[180px] text-center ">
                        <div className="flex gap-2 justify-center">
                          <AlertDialogDemo
                            doctorId={doctor.id}
                            deletingDoctorId={deletingDoctorId}
                            onDelete={handleDeleteDoctor}
                            locale={locale}
                          />
                          <Button
                            className="flex-1 gap-2 text-white hover:bg-primary/90"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => handleProfileClick(doctor.id)}
                          >
                            {locale === Languages.ARABIC ? "عرض الملف" : "View Profile"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="no-doctors">
                    <TableCell colSpan={6} className="text-center h-24">
                      {locale === Languages.ARABIC ? "لا يوجد أطباء" : "No doctors found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        
        <div className="lg:hidden grid grid-cols-1 gap-4 mb-20 md:mb-0">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id || doctor.username}
                className="p-4 shadow-md border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.image ?? undefined} />
                    <AvatarFallback>
                      {doctor.username
                        .split(" ")
                        .map((n : string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{doctor.username}</h3>
                    <p className="text-sm text-gray-500">{doctor.email}</p>
                    <p className="mt-1 bg-primary/70 text-white px-2 py-1 rounded-full w-fit text-sm">
                      {locale === Languages.ARABIC ? doctor.specialty.name_ar : doctor.specialty.name}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-600">
                        {locale === Languages.ARABIC ? "متاح:" : "Available:"}
                      </span>
                      <Switch
                        checked={doctor.availability}
                        onCheckedChange={() => updateSwitch(doctor.id, doctor.availability)}
                        className={locale === Languages.ARABIC ? "text-right" : "text-left"}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <AlertDialogDemo
                    doctorId={doctor.id}
                    deletingDoctorId={deletingDoctorId}
                    onDelete={handleDeleteDoctor}
                    locale={locale}
                  />
                  <Button
                    className="flex-1"
                    onClick={() => handleProfileClick(doctor.id)}
                  >
                    {locale === Languages.ARABIC ? "عرض الملف" : "View Profile"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="p-4 shadow-md border border-gray-200 rounded-2xl">
              <CardContent className="text-center text-gray-500 text-sm">
                {locale === Languages.ARABIC ? "لا يوجد أطباء" : "No doctors found."}
              </CardContent>
            </Card>
          )}
        </div>

      
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 space-x-reverse gap-5 mt-4">
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
                style={currentPage === i + 1 ? { backgroundColor: primaryColor, color: 'white' } : {}}
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
        )}
      </div>
    </div>
  );
}

export function AlertDialogDemo({
  locale,
  onDelete,
  doctorId,
  deletingDoctorId,
}: {
  locale: Locale;
  onDelete: (doctorId: string) => void;
  doctorId: string;
  deletingDoctorId: string | null;
}) {
  const isDeleting = deletingDoctorId === doctorId;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isDeleting}
          className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-100"
        >
          {isDeleting
            ? (locale === Languages.ARABIC ? "جاري الحذف..." : "Deleting...")
            : (locale === Languages.ARABIC ? "حذف" : "Delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
        <AlertDialogHeader className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
          <AlertDialogTitle className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
            {locale === Languages.ARABIC ? "هل أنت متأكد؟" : "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className={locale === Languages.ARABIC ? "text-right" : "text-left"}>
            {locale === Languages.ARABIC
              ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف بيانات هذا الدكتور بشكل دائم."
              : "This action cannot be undone. This will permanently delete this doctor's data."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {locale === Languages.ARABIC ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(doctorId)}
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