import { Metadata } from 'next';
import LeadsPageClient from './leads-client';

export const metadata: Metadata = {
  title: 'Leads - CRM Nexus',
  description: 'Manage your leads and prospects',
};

export default function LeadsPage() {
  return <LeadsPageClient />;
}
