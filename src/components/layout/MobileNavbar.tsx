"use client"

import { Button } from "@/components/ui/button";
import Themetoggle from "../toggle";

import { SignInButton, SignOutButton , useAuth} from "@clerk/nextjs";
import SearchDialog from "../shared/SearchDialog";
import { Input } from "../ui/input";

function MobileNavbar() {
  const {isSignedIn} = useAuth()

  return (
    <div className="flex md:hidden items-center space-x-1">
      <SearchDialog
      trigger={
        <Input
        placeholder="Search"
        className="w-[90px] bg-secondary border-primary" 
       />
      }
      />
      <Themetoggle />

      {isSignedIn ? (
        <SignOutButton>
          <Button 
          variant={"outline"}
          >
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
