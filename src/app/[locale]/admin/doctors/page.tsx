import React from 'react'
import AllDoctors from './_components/AllDoctors'
import { getAllDoctor } from '@/server/db/doctors'

const DoctorsAdminPage = async() => {
    const allDoctors = await getAllDoctor()
  return (
  <AllDoctors doctors={allDoctors} />
  )
}

export default DoctorsAdminPage