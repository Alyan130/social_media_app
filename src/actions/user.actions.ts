"use server"

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function syncUser(){
 try{
   const {userId} = await auth()
  const user = await currentUser()

  if(!userId || !user) return

  const existingUser = await prisma.user.findUnique({
    where:{
      clerkId : userId,
    },
  }) 
  
  if(existingUser) return existingUser;

  const dbUser = await prisma.user.create({
    data:{
        clerkId : userId,
        name : `${user.firstName || ""} ${user.lastName || ""}`,
        username : user.emailAddresses[0].emailAddress.split('@')[0],
        email : user.emailAddresses[0].emailAddress,
        image : user.imageUrl,
        },
  })
  return dbUser;
}catch(error){
    console.log("Error regarding sync user in db",error); 
    return null
}
}



export async function getUserByClerkId(clerkId: string){
  try{
    const dbUser = await prisma.user.findUnique({
      where:{
        clerkId:clerkId,
      },
      include:{
        _count:{
          select:{
            followers:true,
            following:true,
            posts:true,
          },
        },
      },
    })
    return dbUser;
  }
  catch(error){
    console.log("Error regarding get user by clerk id",error);
    return null;
  }
}


export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}


export async function getRandomUsers(){
   const userId = await getDbUserId()

   if(!userId) return []

  try{
   const randomUsers = await prisma.user.findMany({
    where:{
      AND:[
        { NOT:{id:userId}},
        {
          NOT:{
            followers:{
              some:{
                followerId:userId
              }
            }
          }
        }
      ]
    },
    select:{
      id:true,
      name:true,
      username:true,
      image:true,
      _count:{
        select:{
          followers:true
        }
      }
    },
    take : 3
   })

   return randomUsers

  }catch(error){
    console.log("Error fetching random users", error);
    return []
  }
   } 

  
export async function toggleFollow(targetUserId:string){
  try{
  const userId = await getDbUserId()
  
  if(!userId) return

  if(userId === targetUserId) throw new Error("User cannot follow itself")

  const existingUser = await prisma.follows.findUnique({
    where:{
      followerId_followingId:{
        followerId:userId,
        followingId:targetUserId
      },
    }
  })

  if(existingUser){
    await prisma.follows.delete({
      where:{
        followerId_followingId:{
        followerId:userId,
        followingId:targetUserId
        }
      }
    })
  }else {
    await prisma.$transaction([
      prisma.follows.create({
        data: {
          followerId: userId,
          followingId: targetUserId,
        },
      }),

      prisma.notification.create({
        data: {
          type: "FOLLOW",
          userId: targetUserId,
          creatorId: userId,
        },
      }),
    ]);
  }
    revalidatePath("/")
    return {"success":true}
  }catch(error){
     console.log("Error folowing user",error);
      return { success: false, error: "Error toggling follow" }
  }
  }


  
export async function getAllUsers(){
 try{
  const userId = await getDbUserId()
  if (!userId) return;

  const allUsers = await prisma.user.findMany({
    where:{
      NOT:{id:userId}
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
  })

  return allUsers;
 }catch(error){
  console.log("Error fetching all users", error);
  return []
 }
}

