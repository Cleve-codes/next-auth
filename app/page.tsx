'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Implementation of Next AuthFlow</h1>
      <p className="text-lg mb-8">Try it out by logging in or registering.</p>
      <div className="flex space-x-4">
        <Button onClick={() => router.push('/login')}>Login</Button>
        <Button variant="secondary" onClick={() => router.push('/signup')}>
          Register
        </Button>
      </div>
    </div>
  );
}
