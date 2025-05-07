import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "../../../public/assests/logo.webp";
import Image from "next/image";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translations";

const Footer = async() => {
  const locale = await getCurrentLocale()
  const translations = await getTrans(locale)
  return (
    <footer className="py-10">
      <div className="container mx-auto">
        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-700">
          {/* Logo and Description */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Image src={logo} alt="Logo" width={500} height={300} />
            </h2>
            <p className="text-sm mt-3">
          {translations.footer.description}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{translations.footer.company.title}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">{translations.footer.company.aboutUs}</a></li>
              <li><a href="#" className="hover:text-primary">{translations.footer.company.terms}</a></li>
              <li><a href="#" className="hover:text-primary">{translations.footer.company.PrivacyPolicy}</a></li>
              <li><a href="#" className="hover:text-primary">{translations.footer.company.ContactUs}</a></li>
            </ul>
          </div>

          {/* Blog Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{translations.footer.company.blog.title}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">{translations.footer.company.blog.p1}</a></li>
              <li><a href="#" className="hover:text-primary">{translations.footer.company.blog.p2}</a></li>
              <li><a href="#" className="hover:text-primary">{translations.footer.company.blog.p3}</a></li>
              <li><a href="#" className="hover:text-primary">{translations.footer.company.blog.p4}</a></li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{translations.footer.company.ContactUs}</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-primary hover:text-white transition">
                <FaFacebookF />
              </a>
              <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-primary hover:text-white transition">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-primary hover:text-white transition">
                <FaInstagram />
              </a>
              <a href="#" className="p-2 bg-gray-200 rounded-full hover:bg-primary hover:text-white transition">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
