import React from 'react';

import { getSlotsDoctor } from '@/server/db/appointments';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import AvailabilitySimple from './_components/Availbility';

const AvailbilityPage = async () => {
  const session = await getServerSession(authOptions);
  const doctorId = session?.user.id;
  const slots = await getSlotsDoctor(doctorId);
  console.log(slots)
  return (
    <AvailabilitySimple
     slots={slots}
    />
  );
};

export default AvailbilityPage;