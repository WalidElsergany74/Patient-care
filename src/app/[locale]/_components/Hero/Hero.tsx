

import React from 'react';
import { Button } from '../../../../components/ui/button';
import Image from 'next/image';
import hero from "../../../../../public/assests/me.png"
import Link from 'next/link';
import { getCurrentLocale } from '@/lib/getCurrentLocale';
import getTrans from '@/lib/translations';
import { Languages } from '@/constants';

const Hero = async () => {
    const locale = await getCurrentLocale()
    const {home } = await getTrans(locale)
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-6">
    {/* Left Side - Text */}
    <div className="flex flex-col gap-6">
      <h5 className="text-primary text-sm md:text-base font-medium uppercase tracking-widest">
        - {home.shortTitle}
      </h5>
  
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
        {locale === Languages.ENGLISH ? (
          <>
            Optimal <span className="text-primary">Health</span>, One Click Away
          </>
        ) : (
          <>
            <span className="text-primary">{home.Health}</span> {home.optimal} {home.OneClickAway}
          </>
        )}
      </h1>
  
      <p className="text-gray-600 text-lg md:max-w-md leading-relaxed">
        {home.description}
      </p>
  
      <Link href={`/${locale}/doctors`}>
        <Button
          className="rounded-full text-base w-fit px-8 py-3 shadow-md hover:shadow-lg transition-all duration-300"
          size="lg"
          aria-label="Book an appointment with a doctor"
        >
          {home.BookAppointment}
        </Button>
      </Link>
    </div>
  
    {/* Right Side - Image */}
    <div className="flex justify-center md:justify-end">
      <Image
        src={hero}
        alt="Professional doctor ready to assist patients"
        width={450}
        height={450}
        priority
        className="w-full md:w-[80%] object-cover "
      />
    </div>
  </section>
  
  );
};

export default Hero;
