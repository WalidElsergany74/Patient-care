import React from 'react'
import Navbar from './Navbar'
import AuthButtons from './AuthButtons'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth'
import { getCurrentLocale } from '@/lib/getCurrentLocale'
import getTrans from '@/lib/translations'
import Logo from './Logo'


const Header = async () => {
  const initialSession = await getServerSession(authOptions)
  const locale = await getCurrentLocale()
  const  translation = await getTrans(locale)
  
  return (
    <header className='py-3 px-6 lg:px-8 bg-gray-50 sticky top-0 z-50'>
        <div className="container max-w-6xl mx-auto  flex justify-between items-center ">
            {/* <Link className='text-primary font-semibold text-2xl' href={`/${locale}`}> 
            <Image src={logo} alt='logo' width={200} height={150} priority />
            </Link> */}
            <Logo/>
           
            <Navbar translation={translation} initialSession={initialSession}  />
            
           <div className="lg:block hidden">
           <AuthButtons translation={translation} initialSession={initialSession}/>
           </div>
       
        </div>
    </header>
  )
}

export default Header