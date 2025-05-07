import Image from "next/image";
import { getSingleDoctor } from "@/server/db/doctors";
import BookButton from "@/components/BookButton";
import { Metadata } from "next";
import { MapPin } from "lucide-react";
import checkImg from "../../../../../../public/check.svg";
import aboutImg from "../../../../../../public/wait.svg";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";
import { Languages } from "@/constants";


interface SingleDoctorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SingleDoctorPageProps): Promise<Metadata> {
  const doctor = await getSingleDoctor(params.id);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
      description: "The requested doctor could not be found.",
    };
  }

  return {
    title: `${doctor.username} `,
    description: `Book an appointment with Dr. ${doctor.username}, a ${doctor.specialty?.name} with ${doctor.experience} years of experience. Affordable consultation at ${doctor.price} EGP.`,
    keywords: [
      doctor.username,
      "doctor appointment",
      "book doctor online",
      "Egypt doctor",
      `${doctor.specialty?.name} specialist`,
    ],
    openGraph: {
      title: `Dr. ${doctor.username} - ${doctor.specialty?.name}`,
      description: `Consult Dr. ${doctor.username}, a ${doctor.specialty?.name} with ${doctor.experience} years of experience.`,
      images: [doctor.image || "/default-doctor.png"],
      url: `/doctors/${params.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Dr. ${doctor.username} - ${doctor.specialty?.name}`,
      description: `Book an appointment with Dr. ${doctor.username}.`,
      images: [doctor.image || "/default-doctor.png"],
    },
  };
}



const SingleDoctor = async ({ params }: SingleDoctorPageProps) => {
  const doctor = await getSingleDoctor(params.id);
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  if (!doctor) {
    return <div className="text-center text-gray-600 py-10">{translations.noDoctorsFound}</div>;
  }

  return (
 
<section className="py-10 ">
  <div className=" relative container max-w-6xl mx-auto py-3 px-3 lg:px-8">
    <div className="flex flex-col md:flex-row gap-8">

      {/* Image Wrapper */}
      <div className="relative mx-auto w-full max-w-xs md:static">
        <Image
          src={doctor.image || "/default-doctor.png"}
          alt={doctor.username}
          width={300}
          height={300}
          priority
          className="bg-primary w-full rounded-xl object-cover"
        />
      </div>

      {/* Info Box */}
      <div className="md:static md:flex-1 mt-[-80px] md:mt-0 z-10 mx-1">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs w-full">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {locale === Languages.ARABIC ? "د." : "Dr."}
                   {locale === Languages.ARABIC ? doctor.username_ar : doctor.username}
            </h1>
            <Image src={checkImg} alt="Check Icon" width={22} height={22} />
          </div>

          <div className="flex items-center gap-3 text-gray-600 text-sm md:text-base mb-4">
            <p>   {locale === Languages.ARABIC ? doctor?.specialty?.name_ar : doctor.specialty?.name}</p>
            <span className="py-1 px-2 text-xs md:text-sm border rounded-full">
              {doctor.experience} {translations.singleDoctor.years}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <p>{translations.singleDoctor.About}</p>
              <Image src={aboutImg} alt="About Icon" width={14} height={14} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
            {locale === Languages.ARABIC ? "د." : "Dr."}
            {locale === Languages.ARABIC ? doctor.username_ar : doctor.username}  {locale === Languages.ARABIC ? doctor.bio_ar : doctor.bio_en}
           
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-800"> {locale === Languages.ARABIC ? doctor.address_ar : doctor.address_en}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <p className="text-gray-700 font-medium text-sm md:text-base">
              {translations.singleDoctor.AppointmentFee}:{" "}
              <span className="text-gray-900 font-semibold">
                {doctor.price} {translations.home.doctorSection.doctorCard.CURRENCY}
              </span>
            </p>
            <BookButton locale={locale} translations={translations} doctor={doctor} />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default SingleDoctor;
