import { auth } from "@clerk/nextjs/server";
import {createUploadthing, type FileRouter} from "uploadthing/next";


const f = createUploadthing()

export const ourFileRouter = {
    mediaUploader:f({
        image:{
            maxFileSize:"4MB",
            maxFileCount:1
        },
        video:{
            maxFileSize:"64MB",
            maxFileCount:1
        }
    })
    .middleware(async () => {
        const {userId} = await auth()
        if(!userId){
            throw new Error("Unauthorized")
        }
        return { userId }
    })
   .onUploadComplete(async ({metadata,file}) => {
      try{
       const isVideo = file.name.endsWith(".mp4") || file.name.endsWith(".mov") || file.name.endsWith(".mkv")
       const filetype = isVideo ? "video" : "image";
       return {
            fileUrl:file.url,
            fileType:filetype,
        }
       }catch(error){
        console.log("Error uploading file to uploadthing",error)
        throw Error
       }
   })
} satisfies FileRouter


export type OurFileRouter = typeof ourFileRouter

