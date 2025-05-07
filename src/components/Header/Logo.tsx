"use client"
import React from 'react'

import Image from 'next/image'
import logo from "../../../public/assests/logo.webp"
import { useParams } from 'next/navigation'
import Link from 'next/link'
const Logo = () => {
    const {locale} = useParams()
  return (
    <Link className='' href={`/${locale}`}> 
    <Image src={logo} alt='logo' className='w-36 md:w-52 ' width={200} height={150} priority />
    </Link>
  )
}

export default Logo