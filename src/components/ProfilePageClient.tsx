import { getProfileByUser, getUserPosts } from '@/actions/profile.action'
import React from 'react'


type User = Awaited<ReturnType<typeof getProfileByUser>>
type Posts = Awaited<ReturnType<typeof getUserPosts>>
type Post = NonNullable<Posts>[number]

interface ProfileProps{
    user:User,
    posts:Post[],
    likedPosts:Post[],
    isfollowing:boolean
}

function ProfilePageClient({user,posts,likedPosts,isfollowing}:ProfileProps) {
  return (
    <>
    <h1>{user?.name}</h1>
    <h1>{posts?.length}</h1>
    <h1>{likedPosts?.length}</h1>
    <h1>{isfollowing ?? false}</h1>
    </>
  )
}

export default ProfilePageClient