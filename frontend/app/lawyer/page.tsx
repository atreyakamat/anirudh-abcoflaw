import { SessionGate } from '@/components/session-gate';
import { RoleWorkspace } from '@/components/role-workspace';

export default function LawyerPage() {
  return (
    <SessionGate mode="staff" allowedRoles={['lawyer', 'admin']} redirectTo="/admin/login">
      <RoleWorkspace
        title="Lawyer Workspace"
        subtitle="Review consultations, make decisions, and keep the practice focused on legal work rather than administration."
        primaryHref="/admin/analytics"
        primaryLabel="View analytics"
        secondaryHref="/admin/blogs"
        secondaryLabel="Open blog CMS"
        cards={[
          { title: 'Consultations to review', value: '05', description: 'Matters waiting for confirmation or reschedule.' },
          { title: 'Confirmed today', value: '03', description: 'Appointments ready for consultation.' },
          { title: 'Draft insights', value: '02', description: 'Content ideas and follow-up notes ready to publish.' },
        ]}
        notes={[
          'Review pending consultations and confirm or reject them.',
          'Add consultation notes immediately after each session.',
          'Publish one high-value legal article this week.'
        ]}
      />
    </SessionGate>
  );
}
