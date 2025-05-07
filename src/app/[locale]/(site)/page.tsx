import DoctorsSection from "@/app/[locale]/_components/DoctorSection/DoctorSection";
import Footer from "@/components/Footer/Footer";
import Hero from "@/app/[locale]/_components/Hero/Hero";
import StepsSection from "@/app/[locale]/_components/StepsSection";



export default function Home() {
  return (
  <>
 <main className="container max-w-6xl mx-auto py-3 px-3 lg:px-8">
 <Hero />
  <StepsSection />
  <DoctorsSection/>
  <Footer/>
 </main>
  </>
  );
}
