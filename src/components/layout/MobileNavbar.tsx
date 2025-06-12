"use client"

import { Button } from "@/components/ui/button";
import Themetoggle from "../toggle";

import { SignInButton, SignOutButton , useAuth} from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

function MobileNavbar() {
  const {isSignedIn} = useAuth()

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Themetoggle />

      {isSignedIn ? (
        <SignOutButton>
          <Button variant="ghost">
            <LogOutIcon className="w-4 h-4" />
            Logout
          </Button>
        </SignOutButton>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">
            Sign In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default MobileNavbar;
