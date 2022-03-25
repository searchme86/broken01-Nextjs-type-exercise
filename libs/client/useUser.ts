import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR('/api/users/me');

  useEffect(() => {
    //data가 있고, data.ok가 false라면
    if (data && !data.ok) {
      router.replace('/enter');
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
