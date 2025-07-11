"use server"

import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.actions"

export async function getNotifications(){
  
 try {
 const userId = await getDbUserId()
    
 if (!userId) return 

 const notifications =  prisma.notification.findMany({
     where : {
        userId:userId,
     },
     include:{
        creator:{
            select:{
                id:true,
                name:true,
                username:true,
                image:true,
            },
        },
        post:{
            select:{
                id:true,
                content:true,
                image:true
            },
        },
       comment:{
        select:{
            id:true,
            content:true,
            createdAt:true
        },
       },
       },
       orderBy :{
        createdAt:"desc"
       }
 }) 

return notifications;
 }catch(error){
    console.log("Error getting notifications",error);
    return [];
 }
}


export async function readNotifications(notificationIds:string[]){

 try {
 const userId = await getDbUserId()
    
 if (!userId) return 

 await prisma.notification.updateMany({
     where : {
        id : {
            in : notificationIds
        }
     },
     data : {
        read:true
     }
 }) 
 return {success:true}
 }catch(error){
    console.log("Error reading notifications",error);
    return {success:false}
 }
}