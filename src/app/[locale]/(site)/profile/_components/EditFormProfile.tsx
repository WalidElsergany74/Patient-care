
"use client";

import FormFields from "@/components/form-fields/FormFields";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
// import { InputTypes, Routes } from "@/constants";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types";
import { Translations } from "@/types/Translations";
import { ValidationErrors } from "@/validation";
import { UserRole } from "@prisma/client";
import { CameraIcon } from "lucide-react";
import { Session } from "next-auth";
// import { useSession } from "next-auth/react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { updateProfile } from "../_actions/profile";
import { InputTypes, Languages, Routes } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Locale } from "@/i18n.config";
import { toast } from "sonner";
import Checkbox from "../../../../../components/form-fields/Checkbox";
import { useSession } from "next-auth/react";

function EditUserForm({
  translations,
  user,
  locale
}: {
  translations: Translations;
  user: Session["user"];
  locale : Locale
}) {
  const session = useSession();
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
  const [gender, setGender] = useState(user.gender?.toString() ?? "");
const [age, setAge] = useState(user.age?.toString() ?? "");


const [state, action, pending] = useActionState(
    async (prevState: typeof initialState, formData: FormData) => {
      formData.set("gender", gender);
      formData.set("age", age);
      
      return await updateProfile(isAdmin, prevState, formData);
    },
    initialState
  );
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations,
  });
  console.log(state)

  useEffect(() => {
    if (state.message && state.status && !pending) {
     toast.success(state.message)
    }
  }, [pending, state.message, state.status]);

  useEffect(() => {
    setSelectedImage(user.image as string);
  }, [user.image]);


  return (
    <form action={action} className="flex flex-col bg-white md:flex-row gap-10 max-w-full md:max-w-3xl mx-auto border rounded-xl shadow-lg p-3 md:p-8">
      <div className="group relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] overflow-hidden rounded-full mx-auto">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={user.username}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        )}

        <div
          className={`${
            selectedImage
              ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
              : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
          <UploadImage setSelectedImage={setSelectedImage} />
        </div>
      </div>
      <div className="flex-1 ">
        {getFormFields().map((field: IFormField) => {
          const fieldValue =
            state?.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div key={field.name} className="mb-3">
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

  

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ">
 
  <div className="my-2">
    <Label className="mb-2" htmlFor="gender">
      {translations.profile.gender.label || "النوع"}
    </Label>
  
    <Select name="gender" value={gender} onValueChange={setGender}>
      <SelectTrigger dir={locale === Languages.ARABIC ? "rtl" : "ltr"} className="w-full">
        <SelectValue
          className={locale === Languages.ARABIC ? "text-right" : "text-left"}
          placeholder={translations.profile.gender?.placeholder || "يشي"}
        />
      </SelectTrigger>
      <SelectContent dir={locale === Languages.ARABIC ? "rtl" : "ltr"}>
        <SelectItem value="Male">{translations.profile.gender?.options.male}</SelectItem>
        <SelectItem value="Female">{translations.profile.gender?.options.female}</SelectItem>
      </SelectContent>
    </Select>
    {session.data?.user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4">
            <Checkbox
              name="admin"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              label="Admin"
            />
          </div>
        )}
  </div>


  <div className="my-2">
    <Label className="mb-2" htmlFor="age">
      {translations.profile.age.label || "العمر"}
    </Label>
   
    <Select name="age" value={age} onValueChange={setAge}>
      <SelectTrigger dir={locale === Languages.ARABIC ? "rtl" : "ltr"} className="w-full">
        <SelectValue
          className={locale === Languages.ARABIC ? "!text-right" : "text-left"}
          placeholder={translations.profile.age?.placeholder || "اختر عمرك"}
        />
      </SelectTrigger>
      <SelectContent dir={locale === Languages.ARABIC ? "rtl" : "ltr"}>
        {Array.from({ length: 71 }, (_, i) => 15 + i).map((a) => (
          <SelectItem key={a} value={a.toString()}>
            {a}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>




        <Button type="submit" className="w-full mt-2">
          {pending ? <Loader /> : translations.save}
        </Button>
      </div>
    </form>
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
        className="border rounded-full w-[200px] h-[200px] flex justify-center items-center cursor-pointer"
      >
        <CameraIcon className="!w-8 !h-8 text-accent" />
      </label>
    </>
  );
};