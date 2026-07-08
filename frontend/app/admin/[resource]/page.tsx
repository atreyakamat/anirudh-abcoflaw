import { notFound } from 'next/navigation';
import { adminResources } from '@/components/admin/resource-config';
import { ResourcePage } from '@/components/admin/resource-page';

export default function AdminResourcePage({ params }: { params: { resource: string } }) {
  const config = adminResources[params.resource];
  if (!config) {
    notFound();
  }

  return <ResourcePage {...config} />;
}
