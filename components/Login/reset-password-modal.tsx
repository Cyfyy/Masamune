'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!email) {
        throw new Error("Please enter your email address.");
      }

      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // Corrected API call to '/api/auth/forgot-password'
      const response = await fetch('api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // Handle non-OK response
        const errorMessage = await response.text();  // Read the response body
        throw new Error(errorMessage || 'Failed to send password reset email.');
      }

      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();  // Handle unexpected non-JSON response
      }

      setMessage(data.message || 'Password reset link has been sent to your email.');
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-[400px] max-w-[90%] shadow-2xl bg-background border-orange-200">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            {message && <p className="text-success text-sm">{message}</p>}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Button variant="link" onClick={onClose} className="p-0 h-auto font-normal">
              Login
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
