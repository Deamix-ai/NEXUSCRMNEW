import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Register - CRM Nexus',
  description: 'Create your Bowmans CRM account',
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
