'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ClientDetailRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/accounts/${params.clientId}`);
  }, [router, params.clientId]);

  return <div>Redirecting to Account...</div>;
}
