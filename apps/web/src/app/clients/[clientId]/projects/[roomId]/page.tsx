'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ClientRoomRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/accounts/${params.clientId}/projects/${params.roomId}`);
  }, [router, params.clientId, params.roomId]);

  return <div>Redirecting to Account Room...</div>;
}
