import { SessionGate } from '@/components/session-gate';
import { RoleWorkspace } from '@/components/role-workspace';

export default function ReceptionistPage() {
  return (
    <SessionGate mode="staff" allowedRoles={['receptionist', 'admin']} redirectTo="/admin/login">
      <RoleWorkspace
        title="Receptionist Workspace"
        subtitle="Review incoming inquiries, manage the queue, and prepare client records for the lawyer."
        primaryHref="/admin/appointments"
        primaryLabel="Open appointments"
        secondaryHref="/admin/clients"
        secondaryLabel="View clients"
        cards={[
          { title: 'Pending review', value: '08', description: 'New intake requests awaiting manual screening.' },
          { title: 'Today\'s calls', value: '12', description: 'Bookings and follow-up calls scheduled for today.' },
          { title: 'Documents to verify', value: '04', description: 'Uploaded files needing record linkage.' },
        ]}
        notes={[
          'Prioritize pending review inquiries before lunch.',
          'Confirm document uploads and match them to client records.',
          'Prepare the lawyer handoff list with notes and payments.'
        ]}
      />
    </SessionGate>
  );
}
