"use client"

import { createComment, deletePost, getPosts, toggleLike } from '@/actions/post.actions';
import React, { useState } from 'react'
import { errorToast, successToast } from './Toast';


type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = NonNullable<Posts>[number]

interface postProps{
 post:Post
 dbUserId:string|null
}

function PostCard({post,dbUserId}:postProps) {

const [comment ,setComment]  = useState("")
const [isLiking , setIsLiking] = useState(false)
const [isCommenting, setCommenting] = useState(false)
const [isDeleting, setIsDeleting] = useState(false)
const [hasLiked, setHasLiked] = useState(post?.likes.some(like=>like.userId == dbUserId))
const [optimisticLikes, setOptimisticLikes] = useState(post?._count.likes)
const [showComments , setShowcomments] = useState(false)

const handleLike =async () => {
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

const handleDelete =async() =>{
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

  return (
    <>
    <h1>{post?._count.likes || 0}</h1>
    </>
  )
}

export default PostCard;