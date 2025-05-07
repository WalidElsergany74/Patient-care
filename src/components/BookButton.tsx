"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from 'lucide-react'
import DialogSlot from '@/app/[locale]/(site)/doctors/_components/DialogSlot'
import { DoctorWithRelations } from '@/types/doctors'
import { Translations } from '@/types/Translations'
import { Locale } from '@/i18n.config'
import { useRouter } from 'next/navigation'


const BookButton = ({ doctor , translations , locale }: { doctor: DoctorWithRelations , locale: Locale, translations : Translations }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const handleOpen = () => {
      setOpen(true)
      router.refresh()
    }
  return (
   <>
    <Button
    onClick={() => handleOpen()}
    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white 
    font-medium rounded-lg px-4 py-2 text-sm hover:shadow-md transition-all
    flex items-center"
  >
    <Calendar className="w-4 h-4 mr-2" />
    {translations?.home?.doctorSection?.doctorCard?.bookNow}
  </Button>

     {/* Booking Dialog */}
     <DialogSlot translations={translations} locale={locale} open={open} setOpen={setOpen} doctor={doctor} />
  
   </>
  )
}

export default BookButton