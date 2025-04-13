'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform logout logic here (e.g., clear cookies, local storage, etc.)
    console.log('Logging out...');
    // After logout, redirect to the home page
    router.push('/');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Logging Out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-900">You are being logged out. Please wait...</p>
        </CardContent>
      </Card>
    </div>
  );
}
