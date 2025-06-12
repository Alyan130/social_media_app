"use server"

import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.actions"
import { revalidatePath } from "next/cache"


export async function postCreation(content:string,image:string){  

  const userId = await getDbUserId()
 
   if(!userId) return;

  try{
  const post = await prisma.post.create({
    data:{
      content,
      image,
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

}


export async function createComment(postid:string,comment:string){

}

export async function deletePost(postid:string){
  
}