import {  getAppointmentsAdmin } from '@/server/db/appointments'
import { getAllDoctor } from '@/server/db/doctors'
import { getPatients } from '@/server/db/patients'
import React from 'react'
import AdminDashboard from './_components/AdminDashboard'


const Admin = async() => {
  const doctors = await getAllDoctor()
  const appointments =  await getAppointmentsAdmin()
  const patient = await getPatients()
  
  return (
    <AdminDashboard
    appointments={appointments}
    doctors={doctors}
    patients={patient}
  />
  
  )
}

export default Admin