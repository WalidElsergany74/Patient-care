
"use client";

import Image from "next/image";
import React from "react";

import { DoctorWithRelations } from "@/types/doctors";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import "aos/dist/aos.css"; 
import Link from "../../../../components/link";
import BookButton from "../../../../components/BookButton";
import { Translations } from "@/types/Translations";
import { Locale } from "@/i18n.config";
import { Languages } from "@/constants";

const DoctorCard = ({ doctor , translations , locale}: { doctor: DoctorWithRelations , locale : Locale, translations : Translations }) => {
  
  const router = useRouter();



  const handleCardClick = () => {
    router.push(`/${locale}/doctors/${doctor.id}`);
  };
console.log(doctor.specialty?.name_ar)
  return (
    <div 
      // data-aos="fade-up"
      // data-aos-duration="800"
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden
      transition-shadow duration-700 ease-in-out hover:shadow-2xl
        flex flex-col h-full cursor-pointer"
    >
      {/* Doctor Image */}
      {doctor.image && (
        <div className="w-full h-48 md:h-64 relative overflow-hidden">
          <Image 
            src={doctor.image}
            alt={doctor.username}
            fill
           
            onClick={handleCardClick}
            className="object-cover transition-transform duration-500 hover:scale-105 bg-[#EAEFFF]"
          />
        </div>
      )}

      {/* Doctor Info */}
      <div className="p-2 flex flex-col flex-grow">
        <Link href={`/${locale}/doctors/${doctor.id}`} className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 hover:underline">
        {locale === Languages.ARABIC ? "د.": "Dr."}
        {locale === Languages.ARABIC ? doctor.username_ar : doctor.username}
        </Link>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {locale === Languages.ARABIC ? doctor.bio_ar : doctor.bio_en}
        </p>

        {/* Specialty */}
        <div className="mb-4">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium 
            px-2.5 py-0.5 rounded-full">
            {locale === Languages.ARABIC ? doctor?.specialty?.name_ar : doctor.specialty?.name}
          </span>
        </div>

        {/* Location & Price */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-5 h-5  text-blue-500" />
            <span className="line-clamp-1 mx-2">
              {locale === Languages.ARABIC ? doctor.address_ar : doctor.address_en}
              </span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 py-2">
            <div className="flex items-center text-md font-semibold text-gray-800">
            <span>{doctor.price || "150"} {locale === Languages.ARABIC ? "ج.م" : "EGP"}</span>
            </div>

            
            <BookButton locale={locale} translations={translations} doctor={doctor}/>
          </div>

        </div>
      </div>

   
      
    </div>
  );
};

export default DoctorCard;
