import EditFormProfile from "./_components/EditFormProfile"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"
import getTrans from "@/lib/translations"
import { Pages, Routes } from "@/constants"
import { Locale } from "@/i18n.config"
import { redirect } from "next/navigation"

export default async function ProfilePage(
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
  
  return (
    <div className="">

       <EditFormProfile translations={translations} user={session?.user} locale={locale}/>
    </div>
  )
}
