'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@monorepo/ui';
import { register } from '../../../lib/auth';
import { useAuth } from '../../../components/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const [error, setError] = useState('');
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const tokens = await register({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      
      setAccessToken(tokens.accessToken);
      router.push('/');
    } catch (err) {
      setError('Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full name"
              />
            </div>
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full">
              Sign up
            </Button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}