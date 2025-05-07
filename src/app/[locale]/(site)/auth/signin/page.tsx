import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";


import { Pages, Routes } from "@/constants";
import Form from "./_components/Form";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";


const SigninPage = async () => {
   const locale = await getCurrentLocale()
         const translations = await getTrans(locale)
  return (
    <div className="py-16 md:py-24  flex items-center justify-center ">
      <div className="container mx-auto flex justify-center items-center">
        <div className="w-full max-w-md p-6 bg-white dark:bg-background border dark:border-primary rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-primary dark:text-white mb-4">
            {translations.auth.login.title}
          </h2>
          <Form  translations={translations} />
          <p className="mt-2 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            <span>{translations.auth.login.authPrompt.message}</span>
            <Link
              href={`/${locale}/${Routes.AUTH}/${Pages.Register}`}
              className={`${buttonVariants({
                variant: "link",
                size: "sm",
              })} !text-black dark:!text-white`}
            >
             {translations.auth.login.authPrompt.signUpLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;