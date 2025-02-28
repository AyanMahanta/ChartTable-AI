import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from '../utils/supabase';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return children;
}
