
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"
import getTrans from "@/lib/translations"
import { Pages, Routes } from "@/constants"
import { UserRole } from "@prisma/client"
import { Locale } from "@/i18n.config"
import { redirect } from "next/navigation"
import EditUserForm from "../../(site)/profile/_components/EditFormProfile"

export default async function ProfileAdminPage(
  {
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {

  const session = await getServerSession(authOptions);
  const { locale } = await params;
  const translations = await getTrans(locale);

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  if (session && session.user.role === UserRole.DOCTOR) {
    redirect(`/${locale}/${Routes.DOCTORADMIN}`);
  } 
  if (session && session.user.role === UserRole.PATIENT) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  } 
  return (
    <div className=" py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">{translations.profile.title}</h1>

       <EditUserForm locale={locale} translations={translations} user={session?.user}/>
    </div>
  )
}
