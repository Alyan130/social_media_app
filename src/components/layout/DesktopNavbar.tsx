import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Themetoggle from "../toggle";
import {
  SignInButton,
  UserButton,
} from '@clerk/nextjs'
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.actions";
import { Input } from "../ui/input";
import SearchDialog from "../shared/SearchDialog";

async function DesktopNavbar() {

 const user = await currentUser()

 if(user){
  await syncUser()
 }


  return (
    <div className="hidden md:flex items-center space-x-4">

      <SearchDialog
      trigger={
        <Input
        placeholder="Search"
        className="w-32"
       />
      }
      />

      <Themetoggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>


  
       { user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton/>
 </>
        ):(
           <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
          </SignInButton>
        )}
    </div>
  );
}
export default DesktopNavbar;