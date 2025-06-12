'use client'


import React, { useState, useEffect } from 'react'
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {  useUser } from '@clerk/nextjs';


function MobileBottom() {
  const {isSignedIn,user} = useUser()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <div 
      className={`md:hidden py-2 flex items-center justify-between space-x-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </Button>
      
      {isSignedIn ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              Notifications
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className='size-4 transition-transform duration-300 ease-in-out hover:scale-125 hover:rotate-12 hover:text-blue-500'></UserIcon>
             profile
            </Link>
          </Button>
        </>
      ) : null}
    </div>
  )
}

export default MobileBottom;