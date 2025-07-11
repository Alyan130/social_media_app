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

  function handleSubmit(){

  }

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
            <div className="flex items-center justify-start gap-x-3">
              <Textarea
                placeholder="Whats on your mind?"
                onClick={(event) => setContent(event.currentTarget.value)}
                className="text-muted-foreground text-xl font-semibold min-h-[120px] p-4"
                disabled={isPosting}
              />
            </div>
          </div>

      
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
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
