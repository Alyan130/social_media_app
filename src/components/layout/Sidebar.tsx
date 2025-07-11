import React from 'react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card"
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '../ui/button';
import { currentUser } from '@clerk/nextjs/server';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getUserByClerkId } from '@/actions/user.actions';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { LinkIcon, MapPinIcon } from 'lucide-react';

export default async function Sidebar() {
  const user = await currentUser()
  const dbUser = await getUserByClerkId(user?.id || "")


  if(!user) return <UnAuthenticatedSidebar/>
  
  if(!dbUser) return null;

  return (
    <>
     <div className="sticky top-20 hidden md:block">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${dbUser.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={dbUser.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{dbUser.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>

            {dbUser.bio && <p className="mt-3 text-sm ">{dbUser.bio}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{dbUser._count.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{dbUser._count.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {dbUser.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {dbUser.website ? (
                  <a href={`${dbUser.website}`} className="hover:underline truncate" target="_blank">
                    {dbUser.website}
                  </a>
                ) : (
                  "No website" 
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
   </>
  );
}


const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others.
        </p>
        <SignInButton mode="modal">
          <Button className="w-full mb-2" variant="outline">
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-2" variant="default">
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
);