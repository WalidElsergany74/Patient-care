import { ReactNode } from "react";
import DoctorLayout from "./DoctorLayout";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";
import Logo from "@/components/Header/Logo";
import { LanguageSwitcher } from "@/components/Header/SwitchLanguage";
import { cn } from "@/lib/utils";

export default async function DoctorSectionLayout({ children }: { children: ReactNode }) {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const isRTL = locale === "ar";

  return (
    <div className={cn("min-h-screen flex flex-col", isRTL ? "rtl" : "ltr")}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800  border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <LanguageSwitcher />
        </div>
      </header>
      <div className="flex-1">
        <DoctorLayout locale={locale} translations={translations}>
          {children}
        </DoctorLayout>
      </div>
    </div>
  );
}