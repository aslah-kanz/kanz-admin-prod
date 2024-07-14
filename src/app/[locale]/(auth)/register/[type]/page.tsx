'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeSlash } from 'iconsax-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function RegisterByPagePage() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };
  const [isSent, setIsSent] = useState<boolean>(false);
  return (
    <div className=" h-full">
      {isSent ? (
        <div className=" mx-auto w-full max-w-[540px]">
          <div className="flex flex-col gap-5">
            <div className=" flex flex-col gap-3 text-center">
              <h1 className=" text-2xl font-medium text-neutral-800">
                Email verification sent
              </h1>
              <p className=" text-base text-neutral-500">
                To start using Kanzway, confirm your email address with the
                email we sent to: <br />
                <span className=" font-medium text-primary">
                  paulmelone@example.com
                </span>
              </p>
            </div>
            <p className=" text-center text-neutral-500">
              Didn&apos;t get verification email? <br />
              Check your spam email or{' '}
              <span className=" font-medium text-primary">Resend mail</span>
            </p>
          </div>
        </div>
      ) : (
        <div className=" mx-auto w-full max-w-md">
          <div className=" flex flex-col gap-3 text-center ">
            <h1 className=" text-2xl font-medium text-neutral-800">Sign Up</h1>
            <p className=" text-base text-neutral-500">
              Streamlined access for enhanced control and performance insight.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-6">
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Fullname
              </label>
              <Input
                className=" w-full"
                placeholder="ex: john doe"
              />
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Email
              </label>
              <Input
                className=" w-full"
                placeholder="ex: kanzway@example.com"
              />
            </div>
            <div className=" space-y-1">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Contact Phone
              </label>
              <Input
                className=" w-full"
                placeholder="ex: 044 **** *** ***"
              />
            </div>
            <div className=" flex flex-col gap-2">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Password
              </label>
              <div className=" relative">
                <button
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3"
                >
                  {isShowPassword ? (
                    <EyeSlash
                      size={16}
                      className="  text-gray-500"
                    />
                  ) : (
                    <Eye
                      size={16}
                      className="  text-gray-500"
                    />
                  )}
                </button>
                <Input
                  type={isShowPassword ? 'text' : 'password'}
                  className=" w-full pr-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <label
                htmlFor=""
                className=" text-sm font-medium text-neutral-800"
              >
                Confirm Password
              </label>
              <div className=" relative">
                <button
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3"
                >
                  {isShowPassword ? (
                    <EyeSlash
                      size={16}
                      className="  text-gray-500"
                    />
                  ) : (
                    <Eye
                      size={16}
                      className="  text-gray-500"
                    />
                  )}
                </button>
                <Input
                  type={isShowPassword ? 'text' : 'password'}
                  className=" w-full pr-10"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
          <div className=" my-8">
            <Button
              className=" w-full"
              onClick={() => setIsSent((prev) => !prev)}
            >
              Create Account
            </Button>
          </div>
          <p className=" text-center text-sm font-medium text-neutral-800">
            Already have an account?{' '}
            <Link
              className=" text-primary"
              href="/login"
            >
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
