'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DelayedRedirectClient({id}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/course/${id}`); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}