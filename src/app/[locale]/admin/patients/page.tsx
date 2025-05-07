import React from 'react'

import { getPatients } from '@/server/db/patients'
import PatientsComponent from './_components/Patients'



const PatientsPage = async () => {
    const patients = await getPatients()
  return (
   <PatientsComponent patients={patients}/>
  )
}

export default PatientsPage