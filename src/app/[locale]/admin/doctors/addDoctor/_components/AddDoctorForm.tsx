"use client"

import React, { useActionState, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Languages } from "@/constants"
import Checkbox from "@/components/form-fields/Checkbox"
import { Specialty } from "@prisma/client"
import { addDoctorAction } from "../_actions"
import { ValidationErrors } from "@/validation"
import { toast } from "sonner"
import Loader from "@/components/ui/Loader"


const initialState: {
    message?: string;
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData: null,
  };

const AddNewDoctor = ({ specialties }: { specialties: Specialty[] }) => {
  const [role, setRole] = useState("doctor")
  const [available, setAvailable] = useState(false)
  const [specialization, setSpecialization] = useState<string | null>(null)
  const { locale } = useParams()
  const isArabic = locale === Languages.ARABIC
   const router = useRouter()
      const [state, action, pending] = useActionState(addDoctorAction, initialState);




          useEffect(() => {
            if (state.status && state.message){
              toast.success(state.message)
            }
              if (state.status === 201) {
                router.replace(`/${locale}/admin/doctors`);
                toast.success(isArabic ? "تم انشاء الحساب بنجاح" : "account created successful")
              }
            }, [isArabic, locale, router, state.message, state.status]);

            console.log(Object.fromEntries(state.formData?.entries() || []));

  return (
    <div className="mb-16 md:mb-0">
      <Card className="border-0 shadow-lg max-w-3xl mx-auto">
        <CardHeader className="border-b">
          <CardTitle
            className={`text-2xl text-primary font-bold ${isArabic ? "text-right" : "text-left"}`}
          >
            {isArabic ? "إضافة دكتور جديد" : "Add New Doctor"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div className="md:col-span-2">
              <input type="hidden" name="role" value="DOCTOR" />
            </div>

            {/* First Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName" className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "الاسم الأول باللغة الانجليزية" : "First Name in English"}
              </Label>
              <Input
                id="firstName"
                name="firstname"
                type="text"
                placeholder={isArabic ? "أدخل الاسم الأول باللغة الانجليزية" : "Enter First Name in English"}
                className={isArabic ? "text-right" : "text-left"}
              />
              <span className="text-sm text-red-500">{state?.error?.firstname}</span>
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName" className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "الاسم الأخير باللغة الانجليزية": "Last Name in English"}
              </Label>
              <Input
                id="lastName"
                name="lastname"
                type="text"
                placeholder={isArabic ? "أدخل الاسم الاخير باللغة الانجليزية" : "Enter Last Name in English"}
                className={isArabic ? "text-right" : "text-left"}
              />
              <span className="text-sm text-red-500">{state?.error?.lastname}</span>
            </div>
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstNameAr" className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "الاسم الأول باللغة العربية" : "First Name in Arabic"}
              </Label>
              <Input
                id="firstNameAr"
                name="firstnameAr"
                type="text"
                placeholder={isArabic ? "أدخل الاسم الأول باللغة العربية" : "Enter First Name in Arabic"}
                className={isArabic ? "text-right" : "text-left"}
              />
              <span className="text-sm text-red-500">{state?.error?.firstnameAr}</span>
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastNameAr" className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "الاسم الأخير باللغة العربية" : "Last Name in Arabic"}
              </Label>
              <Input
                id="lastNameAr"
                name="lastnameAr"
                type="text"
                placeholder={isArabic ? "أدخل الاسم الأخير باللغة العربية" : "Enter Last Name in Arabic"}
                className={isArabic ? "text-right" : "text-left"}
              />
              <span className="text-sm text-red-500">{state?.error?.lastnameAr}</span>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "الإيميل" : "Email"}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={isArabic ? "أدخل الإيميل" : "Enter Email"}
                className={isArabic ? "text-right" : "text-left"}
              />
              <span className="text-sm text-red-500">{state?.error?.email}</span>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "كلمة المرور" : "Password"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isArabic ? "أدخل كلمة المرور" : "Enter Password"}
                className={isArabic ? "text-right" : "text-left"}
              />
              <span className="text-sm text-red-500">{state?.error?.password}</span>
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-2">
              <Label className={isArabic ? "text-right" : "text-left"}>
                {isArabic ? "التخصص" : "Specialization"}
              </Label>
              <Select
                value={specialization || undefined}
                onValueChange={(value) => setSpecialization(value === "none" ? null : value)}
                name="specialization"
              >
                <SelectTrigger
                  className={`h-12 text-base w-50 max-w-md ${isArabic ? "text-right !justify-end" : "text-left !justify-start"}`}
                >
                  <SelectValue placeholder={isArabic ? "اختر التخصص" : "Select specialization"} />
                </SelectTrigger>
                <SelectContent>
                  {!specialization && (
                    <SelectItem
                      value="none"
                      className={isArabic ? "text-right" : "text-left"}
                    >
                      {isArabic ? "اختر التخصص" : "Select specialization"}
                    </SelectItem>
                  )}
                  {specialties?.map((spec) => (
                    <SelectItem
                      key={spec.id}
                      value={spec.id}
                      className={isArabic ? "text-right" : "text-left"}
                    >
                      {isArabic ? spec.name_ar : spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="specialization"
                value={specialization === null ? "" : specialization}
              />
              <span className="text-sm text-red-500">{state?.error?.specialization}</span>
            </div>

            {/* Status (Available) */}
            <div className="md:col-span-2 flex items-center gap-4 justify-end">
              <Label className="text-gray-700">
                {available
                  ? isArabic
                    ? "الحالة: متاح"
                    : "Status: Available"
                  : isArabic
                  ? "الحالة: غير متاح"
                  : "Status: Not Available"}
              </Label>
              <Switch
                checked={available}
                onCheckedChange={setAvailable}
                className="data-[state=checked]:bg-blue-600"
              />
              <input type="hidden" name="available" value={available ? "true" : "false"} />
              <span className="text-sm text-red-500">{state?.error?.available}</span>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 mt-1 flex justify-end">
              <Button disabled={pending} type="submit" className="px-8 py-3 text-md">
               {pending ? <>
                <Loader/>   {isArabic
                  ? role === "doctor"
                    ? "إضافة الطبيب"
                    : "إضافة مسؤول"
                  : `Add ${role}`}
               </> : <>
                {isArabic
                  ? role === "doctor"
                    ? "إضافة الطبيب"
                    : "إضافة مسؤول"
                  : `Add ${role}`}
               </>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddNewDoctor
