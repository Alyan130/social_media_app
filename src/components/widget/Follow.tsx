import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getRandomUsers } from '@/actions/user.actions';
import FollowButton from '../shared/FollowButton';
import { log } from 'util';

async function Follow() {
const users = await getRandomUsers();

console.log(users);


  return (
    <>
    <Card>
    <CardHeader>
      <CardTitle>Who to Follow</CardTitle>
    </CardHeader>
     
     { users.length > 0 ? users.map(e=> 
     <>
     <CardContent key={e.id} className='pt-4 flex justify-between items-center px-4'>     
      <div className='flex items-center justify-start gap-x-3'>
        <Avatar>
          <AvatarImage src={e.image as string}></AvatarImage>
        </Avatar>
      <div className='flex flex-col space-y-1'>
      <Link href={`/profile/${e.name}`}><p className='text-primary-foreground font-semibold text-sm'>{e.name}</p></Link>
       <p className='text-muted-foreground text-sm'>@{e.username}</p>
       <p className='text-muted-foreground text-sm'>{e._count.followers} followers</p>
      </div>
      </div>
      <FollowButton userId={e.id}/>
     </CardContent>
     </>):(
     <>
     <h1 className='flex items-center justify-center mb-3'>No users</h1>
     </>
     )}
    </Card>
    </>
  )
}

export default Follow