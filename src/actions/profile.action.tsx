"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.actions";

export const getProfileByUser = async (name: string) => {

  try{  
  const userId = await getDbUserId();
  if (!userId) return null;
  const profile = await prisma.user.findUnique({
    where: {
      username: name,
    },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      location: true,
      website: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
  return profile;
  }catch(error){
    console.log("error fetching profile",error);
  }
  return null;
};


export async function getUserPosts(userId: string) {
    try {

    const user = await getDbUserId();
    if (!user) return null;

      const posts = await prisma.post.findMany({
        where: {
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return posts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw new Error("Failed to fetch user posts");
    }
  }
  

  
export async function getUserLikedPosts(userId: string) {

    try {
    const user = await getDbUserId();
    if (!user) return null;

      const likedPosts = await prisma.post.findMany({
        where: {
          likes: {
            some: {
              userId,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return likedPosts;
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      throw new Error("Failed to fetch liked posts");
    }
  }

  

export const updateProfile = async (formdata:FormData) => {
   const  {userId:clerkId}  = await auth()
   if(!clerkId) return null;

   try{
    const user = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        name: formdata.get("name") as string,
        bio: formdata.get("bio") as string,
        location: formdata.get("location") as string,
        website: formdata.get("website") as string,
      },
    });
    revalidatePath("/profile");
    return {"success":true,"user":user}
   }catch(error){
    console.log("Error updating profile",error);
    return null
   }
}


 
export const isFollowing = async (userId:string) => {
  
try{
 const currentUser = await getDbUserId()
 if (!currentUser) return null;

 const follow = await prisma.follows.findUnique({
  where: {
    followerId_followingId: {
      followerId: currentUser,
      followingId: userId,
    },
  },
 });
 
 return !!follow
}catch(error){
  console.log("Error following user",error);
  return null
}

}