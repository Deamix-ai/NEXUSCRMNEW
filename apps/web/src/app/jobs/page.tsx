'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /jobs to /projects for terminology consistency
export default function JobsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/projects');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">Redirecting...</h2>
        <p className="text-sm text-gray-500">Taking you to Projects</p>
      </div>
    </div>
  );
}
