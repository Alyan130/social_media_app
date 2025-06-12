"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { errorToast, successToast } from './Toast'
import { Loader2Icon } from 'lucide-react'
import { toggleFollow } from '@/actions/user.actions'



function FollowButton({userId}:{userId:string}) {
 const [loading, setLoading] = useState(false)

async function handleFollow(){
 setLoading(true)

 try{
   await toggleFollow(userId)
  successToast("followed user successfully!")

 }catch(error){
  console.log("Error following user",error);
  errorToast("failed to follow user!")
   

 }finally{
  setLoading(false)

 }


}

  return (
    <>
    <Button
     className='dark:bg-secondary dark:text-secondary-foreground px-4'
     disabled={loading}
     onClick={handleFollow}
    >
    {loading ? (
    <>
    <Loader2Icon className='animate-spin'/>
     ...following
    </>
    ) : "Follow" }
    </Button>
    </>
  )
}

export default FollowButton