// app/(dashboard)/doctor/appointments/page.tsx

import React from 'react';

import { getAppointmentsDoctors } from '@/server/db/appointments';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { getCurrentLocale } from '@/lib/getCurrentLocale';
import getTrans from '@/lib/translations';
import AppointmentsViewer from '../_components/AppointmentsViewer';

const AppointmentsDoctorsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <div>يجب تسجيل الدخول لعرض المواعيد</div>;
  }

  const doctorId = session.user.id;

  const [appointments, locale, translations] = await Promise.all([
    getAppointmentsDoctors(doctorId),
    getCurrentLocale(),
    getTrans(await getCurrentLocale()),
  ]);

  return (
    <AppointmentsViewer
      appointments={appointments}
      translations={translations}
      locale={locale}
      viewAs="doctor"
    />
  );
};

export default AppointmentsDoctorsPage;
