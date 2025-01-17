'use client';

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Menu, X, Sun, Moon } from 'lucide-react';
import { LoginModal } from "@/components/Login/login-modal";
import { SignupModal } from "@/components/Login/signup-modal";
import { ForgotPasswordModal } from "@/components/Login/forgot-password-modal";
import { Revalia } from 'next/font/google';
import { Button } from "@/components/ui/button";

const revalia = Revalia({
  subsets: ['latin'],
  weight: "400",
  display: 'swap',
});

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  const handleSwitchToForgotPassword = () => {
    setIsForgotPasswordModalOpen(true);
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const handleCloseAllModals = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className={`text-2xl font-bold text-orange-600 ${revalia.className}`}>
                Masamune
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="#features" className="text-foreground hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">Features</Link>
              <Link href="#cta" className="text-foreground hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">CTA</Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-foreground hover:text-orange-500"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button onClick={handleLoginClick} variant="default">Login</Button>
              <Button onClick={handleSignupClick} variant="outline">Signup</Button>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground hover:text-orange-500"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#features" className="text-foreground hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">Features</Link>
              <Link href="#cta" className="text-foreground hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">CTA</Link>
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-foreground hover:text-orange-500 w-full justify-start"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button onClick={handleLoginClick} className="w-full mt-4">Login</Button>
              <Button onClick={handleSignupClick} variant="outline" className="w-full mt-2">Signup</Button>
            </div>
          </div>
        )}
      </nav>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseAllModals}
        onSwitchToSignup={handleSignupClick}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={handleCloseAllModals}
        onSwitchToLogin={handleLoginClick}
      />
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={handleCloseAllModals}
      />
    </>
  );
}

