"use client"

import React from 'react'
import { Button } from '../ui/button'
import {  useRouter } from 'next/navigation';
import { Pages, Routes } from '@/constants';
import { useClientSession } from '@/hooks/useClientSession';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Translations } from '@/types/Translations';
import { LanguageSwitcher } from './SwitchLanguage';

const AuthButtons = ({ initialSession , translation }: { initialSession: Session | null , translation : Translations }) => {
  const router = useRouter();
  const session =  useClientSession(initialSession)

  return (
    <div className=' items-center justify-end space-x-3 '>
    {!session.data?.user ? (
  <>
  <div className="flex items-center gap-3">
  <Button  
      onClick={() => router.push(`/${Routes.AUTH}/${Pages.LOGIN}`)}
      className="bg-secondary-600 shadow-lg text-primary" 
      size="md" 
      variant="outline"
    >
      {translation.header.buttons.login}
    </Button>
    
    <Button  
      onClick={() => router.push(`/${Routes.AUTH}/${Pages.Register}`)}
      className="shadow-lg" 
      size="md" 
      variant="default"
    >
     {translation.header.buttons.signUp}
    </Button>
     <LanguageSwitcher/>
  </div>
  </>
) : (
  <>
  <div className="flex items-center gap-4">
  <Button onClick={() => signOut()}>{translation.header.buttons.logout}</Button>
  <LanguageSwitcher />
  </div>
  </>
)}

    </div>
  )
}

export default AuthButtons