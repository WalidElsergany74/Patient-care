
import EditUserForm from "@/app/[locale]/(site)/profile/_components/EditFormProfile";
import { Routes } from "@/constants";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translations";
import { getPatient } from "@/server/db/patients";
import { redirect } from "next/navigation";



async function EditUserPage({
  params,
}: {
  params: Promise<{ patientId: string; locale: Locale }>;
}) {
  const { locale, patientId } = await params;
  const translations = await getTrans(locale);
  const user = await getPatient(patientId);
  if (!user) {
    redirect(`/${locale}/${Routes.ADMIN}`);
  }
  
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <EditUserForm locale={locale} translations={translations} user={user} />
        </div>
      </section>
    </main>
  );
}

export default EditUserPage;