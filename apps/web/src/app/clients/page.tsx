'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/accounts');
  }, [router]);

  return <div>Redirecting to Accounts...</div>;
}