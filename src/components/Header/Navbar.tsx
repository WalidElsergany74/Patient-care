"use client";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Routes } from "@/constants";
import Link from "../link";
import Image from "next/image";
import logo from "../../../public/assests/logo.webp";
import AuthButtons from "./AuthButtons";
import { useClientSession } from "@/hooks/useClientSession";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Translations } from "@/types/Translations";
import { LanguageSwitcher } from "./SwitchLanguage";

const Navbar = ({
 initialSession , 
  translation
}
  : { 
    initialSession: Session | null ,
   translation : Translations
     }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const session = useClientSession(initialSession);
  const { locale } = useParams();
  const links = useMemo(() => {
    const baseLinks = [
      { id: "home", title: translation.header.Home, href: Routes.ROOT },
      { id: "doctors", title: translation.header.Doctors, href: Routes.DOCTORS },
    ];
  
    if (session?.data?.user) {
      baseLinks.push({ id: "reservations", title: translation.header.Myreservation, href: Routes.REVERSATION });
    }
  
    return baseLinks;
  }, [
    translation.header.Home,
    translation.header.Doctors,
    translation.header.Myreservation,
    session?.data?.user
  ]);
  

  return (
    <nav className="flex justify-center ">
      <div className="flex-1 flex mx-5 justify-end w-full">
     <div className="flex gap-3 items-center">
     <div className="lg:hidden">
     <LanguageSwitcher />
     </div>
     <Button
          variant={"secondary"}
          size={"sm"}
          className="lg:hidden"
          onClick={() => setOpenMenu(true)}
        >
          <Menu className="!w-6 !h-6" />
        </Button>
  
     </div>
      </div>

      <ul
        className={`
        ${openMenu ? "left-0 z-50 h-screen" : "-left-full"}
        fixed lg:static top-0 flex px-10 py-8 lg:p-0 bg-background lg:bg-transparent transition-all flex-col lg:flex-row gap-10 w-full lg:w-auto items-start lg:items-center`}
      >
        <div className="flex items-center justify-between w-full lg:hidden">
          <Image src={logo} alt="logo" width={200} height={150} />
          <Button
            variant={"secondary"}
            size={"sm"}
            className="lg:hidden"
            onClick={() => setOpenMenu(false)}
          >
            <XIcon className="!w-6 !h-6" />
          </Button>
        </div>

        {links.map((link) => (
          <li key={link.id}>
            <Link
              onClick={() => setOpenMenu(false)}
              className={`hover:text-primary text-base duration-200 transition-colors  font-semibold ${
                pathname === `/${locale}${link.href === '/' ? '' : `/${link.href}`}`
                ? "text-primary" : ""
              }`}
              href={`/${locale}/${link.href}`}
            >
              {link.title}
            </Link>
          </li>
        ))}

        {session.data?.user.role === "ADMIN"   ?
         <>
       
         {session.data.user && (
           <li key="admin">
           <Link
             href={`/${locale}/admin`}
             className={`hover:text-primary duration-200 transition-colors font-semibold tracking-wider ${
               pathname === `/${locale}/admin` ? "text-primary" : ""
             }`}
             onClick={() => setOpenMenu(false)}
           >
           {translation.header.Admin}
           </Link>
         </li>
         )}
         
        </> : <>
          {session.data?.user.role === "DOCTOR" && session.data?.user ?
             <li key="doctorAdmin">
             <Link
               href={`/${locale}/doctorAdmin`}
               className={`hover:text-primary duration-200 transition-colors font-semibold tracking-wider ${
                   pathname === `/${locale}/doctorAdmin` ? "text-primary" : ""
               }`}
               onClick={() => setOpenMenu(false)}
             >
             {translation.header.doctorDashboard}
             </Link>
           </li>
            : 
          <>
          {session.data?.user && (
               <li key="profile">
               <Link
                 href={`/${locale}/profile`}
                 className={`hover:text-primary duration-200 transition-colors font-semibold tracking-wider ${
                     pathname === `/${locale}/profile` ? "text-primary" : ""
                 }`}
                 onClick={() => setOpenMenu(false)}
               >
               {translation.header.Profile}
               </Link>
             </li>
          )}
          </>}
      
        </>} 

        {session.data?.user && (
          <li key="logout" className="flex items-center gap-2">
            <Button
              onClick={() => signOut()}
              className="flex lg:hidden items-center cursor-pointer hover:text-primary duration-200 transition-colors font-semibold"
            >
             {translation.header.buttons.logout}
            </Button>
          </li>
        )}
      
   
        {!session?.data?.user && (
          <li key="auth-buttons" className="lg:hidden flex flex-col gap-4">
            <div onClick={() => setOpenMenu(false)}>
              <AuthButtons translation={translation} initialSession={initialSession} />
            </div>
          </li>
        )}
      </ul>
      
    </nav>
  );
};

export default Navbar;
