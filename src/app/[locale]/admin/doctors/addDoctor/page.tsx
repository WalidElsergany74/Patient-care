import React from 'react'
import AddNewDoctor from './_components/AddDoctorForm'
import { getSpecialties } from '@/server/db/specialties'



const AddDoctorPage = async() => {
    const specialties = await getSpecialties()
    console.log(specialties)
  return (
   <>
   <AddNewDoctor specialties={specialties} />

   </>
  )
}

export default AddDoctorPage