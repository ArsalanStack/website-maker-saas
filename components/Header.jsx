'use client'
import React from 'react'
import Image from "next/image";
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link'

const Header = () => {

  const { user } = useUser();

  return (
    <div className='flex p-4 px-4 sm:px-8 md:px-12 shadow-md items-center justify-between'>
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center">
        <Image src={"/logo.svg"} alt="logo" width={70} height={50} />
        <span className='text-xl sm:text-base font-semibold text-gray-900'>Website Designer</span>
      </Link>

      {/* Navigation Buttons - Hidden on mobile, visible on tablet+ */}
      <div className="hidden sm:flex gap-2 items-center">
        <Button variant={'ghost'}>Pricing</Button>
        <Link href="/workspace">
          <Button variant={'ghost'}>Workspace</Button>
        </Link>
      </div>

      {/* Get Started Button - Only show if user doesn't exist */}
      <div className="">
        {!user ? (
          <SignInButton mode="modal" forceRedirectUrl="/workspace">
            <Button className='flex items-center gap-2 text-xs sm:text-sm'>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </SignInButton>
        ) : null}
      </div>
    </div>
  )
}

export default Header