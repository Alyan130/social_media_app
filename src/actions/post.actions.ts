"use server"

import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.actions"
import { revalidatePath } from "next/cache"


export async function postCreation(content:string,type:string,url:string|null){  

  const userId = await getDbUserId()
 
   if(!userId) return;

  try{
  const post = await prisma.post.create({
    data:{
      content,
      mediaUrl:type,
      mediaType:url,
      authorId:userId
    }
    })
    revalidatePath("/")
    return {"success": true, "post":post}
}catch(error){
     console.log("failed to create post");
     return {"success":false,"message":"unable to create post"}     
}
}


export async function getPosts(){
try{
  const userId = await getDbUserId();
 
  if(!userId) return;

  const posts = await prisma.post.findMany({
    orderBy:{
      createdAt:"desc"
    },
    
    include:{
      author:{
        select:{
          id:true,
          username:true,
          image:true,
          name:true,
        },
      },
     
      comments:{
        include:{
          author:{
            select:{
              id:true,
              username:true,
              image:true,
              name:true,
            },
          },
        },
        orderBy:{
          createdAt:"asc"
        },
      },

      likes:{
        select:{
          userId:true,
        },
      },

      _count:{
        select:{
          likes:true,
          comments:true,
        },
      },
    },
  })

  return posts;

}catch(error){
   console.log("Error fecthing posts",error);
   return []
}
}


export async function toggleLike(postId:string){

  try{

  const userId = await getDbUserId();
  if (!userId) return;

  const existingLike = await prisma.like.findUnique({
    where:{
      userId_postId:{
        userId:userId,
        postId:postId
      }
    }
  })

  const post = await prisma.post.findUnique({
    where:{
      id:postId
    },
    select:{authorId:true}
  })

if (!post) throw new Error("Post not found");

if(existingLike){
   await prisma.like.delete({
    where:{
      userId_postId:{
         userId:userId,
         postId:postId
      }
    }
   })  
}else{
  await prisma.$transaction([
    prisma.like.create({
      data: {
        userId,
        postId,
      },
    }),
    ...(post.authorId !== userId
      ? [
          prisma.notification.create({
            data: {
              type: "LIKE",
              userId: post.authorId,
              creatorId: userId,
              postId,
            },
          }),
        ]
      : []),
  ]); 
  revalidatePath("/")
  return {success:true}
} 
  } catch(error){
    console.log(error);
    return {success:false,message:"unable to like post"}
}
}


export async function createComment(postId:string,content:string){
  
  try{

  const userId = await getDbUserId();
  
  if(!userId) return;
   
  const post = await prisma.post.findUnique({
    where:{
      id:postId
    },
    select:{authorId:true}
  })

  if (!post) throw new Error("Post not found");
  
  const [comment] = await prisma.$transaction(async (tx) => {
    const newComment = await tx.comment.create({
      data: {
        content:content,
        authorId: userId,
        postId,
      },
    });

    if (post.authorId !== userId) {
      await tx.notification.create({
        data: {
          type: "COMMENT",
          userId: post.authorId,
          creatorId: userId,
          postId,
          commentId: newComment.id,
        },
      });
    }
    return [newComment];
  });

   revalidatePath("/")
   return {success:true,comment}
} catch(error){
  console.log(error);
  return {success:false,message:"unable to create comment"}
}
 }


 
export async function deletePost(postId:string){

  try{
   const userId = await getDbUserId();
  
   if(!userId) return;

   const post = await prisma.post.findUnique({
     where :{
      id:postId
     },
     select :{authorId:true} 
   })

   if (!post) throw new Error("Post not found");
   
   if(post.authorId !== userId) return;
    
   await prisma.post.delete({
    where:{
      id:postId
    }    
   })
  
   revalidatePath("/")
   return {success:true,message:"post deleted successfully"}
  }catch(error){
    console.log(error);
    return {success:false,message:"unable to delete post"}
  }
}