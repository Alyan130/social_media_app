"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Copy, Plus, PowerOffIcon, User } from "lucide-react";
import { successToast } from './Toast';
import { Return } from '@prisma/client/runtime/library';
import { getAllUsers } from '@/actions/user.actions';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { UserProfile } from '@clerk/nextjs';
import Link from 'next/link';

type Users = Awaited<Return<typeof getAllUsers>>


function SearchDialog({trigger}:{trigger:React.ReactNode}) {
  
const [name,setName] = useState("")
const [users, setUsers] =useState<Users>([])


useEffect(()=>{
   const fetchUsers = async () =>{
      const allusers = await getAllUsers()
      const filteredUsers = allusers.filter((user) => user?.name.toLowerCase().includes(name.toLowerCase()));
      setUsers(filteredUsers)
      console.log("all users",allusers);
   }
   fetchUsers() 
},[name])

  return (
   <>
   <Dialog>
  <DialogTrigger>{trigger}</DialogTrigger>
  <DialogContent className='p-4'>
    <DialogHeader className='flex justify-center items-center p-3'>
      <DialogTitle className='w-full mb-5 mt-2'>
        <Input placeholder='Search' 
         value={name} 
         onChange={(e)=>setName(e.target.value)}
         className='w-full mt-2 '
         />
      </DialogTitle>
      <DialogDescription className='w-full mt-4'>
    <div className='w-full space-y-2'>
      {users.length > 0 ? users.map((user) => (
        <div key={user.id} className="flex items-center justify-between border-b-2 border-border pb-2">
          <div className="flex items-center">
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>{user.name}</span>
          </div>
          <div className="flex items-center">
            <Link href={`/profile/${user.username}`}>
             <button className="mr-2">
             <User className="w-4 h-4" />
            </button>
            </Link>
          </div>
        </div>
      )) : <span>No users found</span>}
      </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
   </> 
  )
}

export default SearchDialog