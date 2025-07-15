"use client"

import { createComment,  deletePost, getPosts, toggleLike } from '@/actions/post.actions';
import React, { useState } from 'react'
import { errorToast, successToast } from './Toast';
import { formatDistanceToNow } from "date-fns";
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '../ui/button';
import { HeartIcon, LoaderIcon, LogInIcon, MessageCircleIcon, MessageSquareIcon, SendIcon } from 'lucide-react';
import { Card,CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import DeleteAlert from './DeleteAlert';
import { Textarea } from '../ui/textarea';

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = NonNullable<Posts>[number]

interface postProps{
 post:Post
 dbUserId:string|null
}

function PostCard({post,dbUserId}:postProps) {

const user = useUser()  
const [comment ,setComment]  = useState("")
const [isLiking , setIsLiking] = useState(false)
const [isCommenting, setCommenting] = useState(false)
const [isDeleting, setIsDeleting] = useState(false)
const [hasLiked, setHasLiked] = useState(post?.likes.some(like=>like.userId == dbUserId))
const [optimisticLikes, setOptimisticLikes] = useState(post?._count.likes)
const [showComments , setShowcomments] = useState(false)

const handleLike = async () => {
 if (isLiking) return
 
 try{
   setIsLiking(true)
   setHasLiked(!hasLiked)
   setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1))
   await toggleLike(post.id)
  }
  catch(error){
   errorToast("error while doing like")
   console.log("error while like",error);
   setHasLiked(post.likes.some(like=>like.userId === dbUserId))
   setOptimisticLikes(post._count.likes)
 }
 finally{
   setIsLiking(false)
 }
}


const handleComment =async () => {
 if (isCommenting) return 

 try{
  setCommenting(true)
  await createComment(post.id, comment)
  successToast("comment added successfully")
  setComment("")
 }
 catch(error){
  errorToast("Error while comment")
  console.log(error);
 }
 finally{
  setCommenting(false)
 }
}

const handleDelete = async() =>{
if (isDeleting) return

try{
  setIsDeleting(true)
  await deletePost(post.id)
  successToast("post deleted sucesfully!")
}
catch(error){
errorToast("fail to delete post") 
console.log(error);
}
finally{
  setIsDeleting(false)
}
}

  return (
    <>
     <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>@{post.author.username}</Link>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                  </div>
                </div>
                {
                  post.author.id === dbUserId ? 
                  <DeleteAlert isDeleting={isDeleting} onDelete = {handleDelete}/>
                 : null
                }
                </div>
                <p className="mt-1 text-sm text-foreground break-words">{post.content}</p>
            </div>
          </div>

          {post.mediaUrl &&  
            post.mediaType == "image" &&
           (
            <div className='rounded-lg overflow-hidden'>
             <Image
              src={post.mediaUrl as string}
              alt='Post Image'
              className='w-full h-full object-cover'
              width={300}
              height={300}
              quality={100}
             />
            </div>
          )
           }


           {post.mediaUrl &&
           post.mediaType == "video" &&
           (
            <div className='rounded-lg overflow-hidden'>
             <video
              src={post.mediaUrl as string}
              className='w-full h-full object-cover'
              controls
             />
            </div>
           )
          }
        
          
          <div className="flex items-center space-x-4 pt-2">
          {user ? (
            <Button 
            variant="ghost"
            size="sm"
            className={`text-muted-foreground gap-2 ${
              hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
            }`}
            onClick={handleLike}
            >
            { hasLiked ? (
            <HeartIcon className='size-5 fill-current' />
            ):
            (
            <HeartIcon className='size-5'/>
            )}
           <span>{optimisticLikes}</span>
            </Button>
          ):(
            <SignInButton>
              <Button className='text-muted-foreground gap-2'>
                <HeartIcon className='size-5'/>
                <span>{optimisticLikes}</span>
              </Button>
            </SignInButton>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-2"
            onClick={() => setShowcomments(!showComments)}
          >
            <MessageSquareIcon className={`size-5 ${showComments ? "fill-blue-500" : ""}`} />
            <span>{post._count.comments}</span>
          </Button>
       </div>

       {showComments && (
            <div className="space-y-4 mb-3">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 border p-4 rounded-md">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-sm text-muted-foreground">
                          @{comment.author.username}
                        </span>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm break-words mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              </div>
       )}
       {user ? (
                    <div className="flex space-x-4">
                      <Avatar className="size-8 flex-shrink-0">
                        <AvatarImage src={user?.user?.imageUrl || "/avatar.png"} />
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={handleComment}
                            className="flex items-center gap-2"
                            disabled={!comment.trim() || isCommenting}
                          >
                            {isCommenting ? (
                              <>
                              <LoaderIcon className="size-4 animate-spin"/>
                               Posting...
                              </>
                            ) : (
                              <>
                                <SendIcon className="size-4" />
                                Comment
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="gap-2">
                          <LogInIcon className="size-4" />
                          Sign in to comment
                        </Button>
                      </SignInButton>
                    </div>
                  )}
       </div>
       </CardContent>
      </Card>
    </>
  )
}


export default PostCard