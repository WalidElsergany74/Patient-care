
import { getAppointmentsAdmin } from '@/server/db/appointments'
import getTrans from '@/lib/translations'
import { getCurrentLocale } from '@/lib/getCurrentLocale'
import AppointmentsViewer from '../../doctorAdmin/_components/AppointmentsViewer'

const AdminAppointmentsPage = async () => {
  const appointments = await getAppointmentsAdmin()
  const locale = await getCurrentLocale()
  const translations = await getTrans(locale)

  return (
    <AppointmentsViewer
      translations={translations}
      locale={locale}
      appointments={appointments}
      viewAs="admin"
    />
  )
}
export default AdminAppointmentsPage
