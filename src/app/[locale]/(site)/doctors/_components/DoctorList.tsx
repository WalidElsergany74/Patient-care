"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import DoctorCard from "@/app/[locale]/_components/DoctorSection/DoctorCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DoctorWithRelations } from "@/types/doctors";
import { Translations } from "@/types/Translations";
import { Locale } from "@/i18n.config";
import { Languages } from "@/constants";

interface Specialty {
  name: string;
  name_ar: string | null
}

interface DoctorsListProps {
  doctors: DoctorWithRelations[];
  specialties: Specialty[];
  translations: Translations;
  locale: Locale;
}


const DoctorsList = ({ doctors, specialties, translations, locale }: DoctorsListProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  
  const initialCategory = searchParams.get("specialty") || locale === Languages.ARABIC ? "الكل" : "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = [
    locale === Languages.ARABIC ? "الكل" : "All",
    ...specialties.map((s) => (locale === Languages.ARABIC ? s.name_ar : s.name)),
  ];
  

  
  const handleFilterChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      const params = new URLSearchParams(searchParams);

      if (category === "All" || category === "الكل")
        {
        params.delete("specialty");
      } else {
        params.set("specialty", category);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false }); 
      setIsFilterOpen(false);
    },
    [router, pathname, searchParams]
  );

  const allDoctors = useMemo(() => doctors.flatMap((specialty) => specialty.doctors), [doctors]);

  const filteredDoctors = useMemo(() => {
    if (selectedCategory === "All" || selectedCategory === "الكل") return allDoctors;
  
    return allDoctors.filter((doctor) => {
      const specialtyName = locale === Languages.ARABIC ? doctor.specialty?.name_ar : doctor.specialty?.name;
      return specialtyName === selectedCategory;
    });
  }, [selectedCategory, allDoctors, locale]);
  

  return (
    <div>
   
      <div className="md:hidden flex justify-end mb-4">
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{translations.doctors.filter}</Button>
          </DialogTrigger>
          <DialogContent className="w-4/5 max-w-md">
            <DialogHeader>
              <DialogTitle className="!mb-4 text-lg tracking-wider">{translations.doctors.filterCat}</DialogTitle>
            </DialogHeader>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`p-3 rounded-md cursor-pointer capitalize ${
                    selectedCategory === category ? "bg-primary text-white" : "bg-gray-100 hover:bg-blue-100"
                  }`}
                  onClick={() => handleFilterChange(category as string)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    
        <div className="hidden md:block md:col-span-1">
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category}
                className={`p-3 rounded-md cursor-pointer capitalize ${
                  selectedCategory === category ? "bg-primary text-white" : "bg-gray-100 hover:bg-blue-100"
                }`}
                onClick={() => handleFilterChange(category as string)}
              >
             {category}
              </li>
            ))}
          </ul>
        </div>

    
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => <DoctorCard locale={locale} translations={translations}  key={doctor.id} doctor={doctor} />)
          ) : (
            <p className="col-span-3 text-center text-gray-500">{translations.noDoctorsFound}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
