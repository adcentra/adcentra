'use client';

import React from 'react';
import Image from 'next/image';
import LoginForm from '../components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding/Illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
        <div className="flex flex-col justify-center items-center p-12 w-full">
          <div className="text-center space-y-6">
            <Image
              src="/marketing/light-logo.png"
              alt="adCentra.ai"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome to adCentra.ai
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Programmatic ad booking made easy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile logo */}
          <div className="text-center mb-6 lg:hidden">
            <div className="flex justify-center items-center gap-2">
              <Image
                src="/marketing/light-logo.png"
                alt="adCentra.ai"
                width={50}
                height={50}
                priority
              />
              <h1 className="text-xl font-bold text-foreground">adCentra.ai</h1>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Sign in to your account
            </h2>
          </div>

          {/* Login Form */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <LoginForm />

            {/* Additional options */}
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot your password?
              </a>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
