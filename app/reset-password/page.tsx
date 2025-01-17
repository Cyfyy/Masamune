"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router: AppRouterInstance = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams?.get('token') ?? null;
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Password reset successful. You will be redirected to login.');
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4 bg-green-100 border-green-500 text-green-700">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" onClick={() => router.push('/login')}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;

