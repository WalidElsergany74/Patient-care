import { Metadata } from "next";
import { getSpecialties } from "@/server/db/specialties";
import { getDoctorsBySpecialty } from "@/server/db/doctors";
import DoctorsList from "./_components/DoctorList";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";
import { Languages } from "@/constants";



export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Healthcare - Find Top Doctors",
    description:
      "Discover top doctors specializing in various medical fields and book your appointment easily on the Healthcare platform.",
  };
}

const Doctors = async () => {
  const [specialties, doctors] = await Promise.all([
    getSpecialties(),
    getDoctorsBySpecialty(),
  ]);

  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  return (
    <div className=" py-10 container max-w-6xl mx-auto  px-3 lg:px-8  ">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {locale === Languages.ARABIC ? (
                  <>
                 {translations.doctors.FindBest}   <span className="text-primary">{translations.doctors.bestDoctors}</span>{translations.doctors.patientCare}
                  </>
                ) : (
                  <>
                Find the    <span className="text-primary">Best Doctors</span> on Patient Care
                  </>
                )}
        </h1>
        <p className="mt-4 text-gray-500 text-base md:text-lg">
          {translations.doctors.title || "Find the best doctors and book your appointment easily."}
        </p>
      </div>

     
      {doctors.length > 0 ? (
        <DoctorsList
          locale={locale}
          translations={translations}
          doctors={doctors}
          specialties={specialties}
        />
      ) : (
        <p className="text-center text-gray-500">{translations.noDoctorsFound}</p>
      )}
    </div>
  );
};

export default Doctors;
