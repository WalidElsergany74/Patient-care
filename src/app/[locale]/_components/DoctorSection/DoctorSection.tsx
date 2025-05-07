import { getDoctorsBySpecialty } from "@/server/db/doctors";
import DoctorCard from "./DoctorCard";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Languages, Routes } from "@/constants";
import 'aos/dist/aos.css'
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";


const DoctorsSection = async () => {
  const specialties = await getDoctorsBySpecialty(); 
    const locale = await getCurrentLocale()
    const translations = await getTrans(locale)
     const doctors = specialties.flatMap((specialty) => specialty.doctors).slice(0, 3);
  return (
    <section className="py-8 px-4" >
      <div className="text-center mb-12"
       

        
      >
        <h5 className="text-lg font-medium text-gray-500">- {translations.home.doctorSection.title}</h5>
        <h2 className="text-3xl md:text-4xl font-semibold mt-2">
         {locale === Languages.ARABIC ? (
                 <>
                  {translations.home.doctorSection.DoctorTeam} <span className="text-primary font-bold">{translations.home.doctorSection.Specialist}</span> {translations.home.doctorSection.our}
                 </>
               ) : (
                 <>
                   Our <span className="text-primary font-bold">Specialist</span> Doctor Team
                 </>
               )}
        </h2>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
          <div className="hover:scale-105 transition-transform duration-500" key={doctor.id}>
            <DoctorCard locale={locale} translations={translations} doctor={doctor} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link href={`${locale}/${Routes.DOCTORS}`}>
          <Button className="rounded-full px-10 py-5" size={"lg"}>{translations.home.doctorSection.doctorCard.viewAll}</Button>
        </Link>

     

      </div>
    </section>
  );
};

export default DoctorsSection;
