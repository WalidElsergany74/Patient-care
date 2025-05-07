
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import FormFields from "@/components/form-fields/FormFields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { InputTypes, Languages, Routes } from "@/constants";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types";
import { Translations } from "@/types/Translations";
import { ValidationErrors } from "@/validation";
import { UserRole } from "@prisma/client";
import { CameraIcon } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useActionState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Locale } from "@/i18n.config";
import { toast } from "sonner";
import { updateProfileDoctor } from "../_actions/profile";

function EditUserForm({
  translations,
  user,
  locale,
}: {
  translations: Translations;
  user: Session["user"];
  locale: Locale;
}) {
  const formData = new FormData();
  Object.entries(user).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });

  const initialState: {
    message?: string;
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData,
  };

  const [selectedImage, setSelectedImage] = useState(user?.image ?? "");
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);

  const [state, action, pending] = useActionState(
    async (prevState: typeof initialState, formData: FormData) => {
      return await updateProfileDoctor(isAdmin, prevState, formData);
    },
    initialState
  );

  const { getFormFields } = useFormFields({
    slug: "/doctorAdmin/profile",
    translations,
  });

  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast.success(state.message);
    }
  }, [pending, state.message, state.status]);

  useEffect(() => {
    setSelectedImage(user.image as string);
  }, [user.image]);

  return (
    <div className=" mb-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
     
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-12 w-2 bg-primary rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {locale === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {locale === "ar"
                ? "قم بتحديث معلوماتك الشخصية بسهولة"
                : "Update your personal information with ease"}
            </p>
          </div>
        </div>

      
        <form
          action={action}
          className="flex flex-col md:flex-row gap-10 bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-100"
        >
        
          <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] mx-auto">
            <div className="group relative w-full h-full overflow-hidden rounded-full border-4 border-primary/10 shadow-lg">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={user.username}
                  width={200}
                  height={200}
                  className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-full">
                  <CameraIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                <UploadImage setSelectedImage={setSelectedImage} />
              </div>
            </div>
          </div>

          
          <div className="flex-1 space-y-6">
            {getFormFields().map((field: IFormField) => {
              const fieldValue =
                state?.formData?.get(field.name) ?? formData.get(field.name);
              return (
                <div key={field.name} className="space-y-2">
                  
                  <FormFields
                    {...field}
                    translations={translations}
                    defaultValue={fieldValue as string}
                    error={state?.error}
                    readOnly={field.type === InputTypes.EMAIL}
                   
                  />
                </div>
              );
            })}

         
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 rounded-lg py-3 text-white font-semibold shadow-md hover:shadow-lg"
              disabled={pending}
            >
              {pending ? (
                <Loader className="w-5 h-5 text-white" />
              ) : (
                <span>{translations.save}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserForm;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="flex items-center justify-center w-full h-full cursor-pointer"
      >
        <CameraIcon className="w-8 h-8 text-white drop-shadow-md" />
      </label>
    </>
  );
};
