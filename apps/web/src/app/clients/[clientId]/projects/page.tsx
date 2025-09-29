'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ClientProjectsRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/accounts/${params.clientId}/projects`);
  }, [router, params.clientId]);

  return <div>Redirecting to Account Projects...</div>;
}
