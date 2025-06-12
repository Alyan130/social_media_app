"use client";

import React from "react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "../ui/button"
import { errorToast, successToast } from "../shared/Toast";
import { postCreation } from "@/actions/post.actions";



function CreatePost() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);


  async function handleCreatePost(){
    if(!content.trim() && !imageUrl){
      errorToast("Please add data to create post!")
      return
    }
 
    try{
    const res = await postCreation(content, imageUrl)
    if(res?.success){
       setContent("")
       setImageUrl("")
       setShowImageUpload(false)
      
       successToast("Post created Succesfully!")
       console.log(res.post);
       
    }
    }
    catch(error){
      console.log("Error creating post..",error);
      errorToast("Error creating post!")
      return
    }
    finally{
      setIsPosting(false)
    }

 }

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-x-3 text-sm">
              <Textarea
                placeholder="Whats on your mind?"
                onClick={(event) => setContent(event.currentTarget.value)}
                className="text-muted-foreground text-xl font-semibold min-h-[120px] p-4"
                disabled={isPosting}
              />
            </div>
          </div>

          <div className="w-full pt-6 flex items-center justify-between px-4">
            <Button
              className="bg-background hover-none dark:text-muted-foreground text-gray-600 flex gap-x-3 rounded-md"
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isPosting}
            >
              <ImageIcon />
              Photo
            </Button>

            <Button
              className="bg-primary dark:bg-secondary flex gap-x-3 rounded-md items-center runded-md"
              onClick={handleCreatePost}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="animate-spin mr-3" />
                 posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default CreatePost;
