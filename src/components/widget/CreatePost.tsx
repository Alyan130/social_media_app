"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { BotIcon, ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { errorToast, successToast } from "../shared/Toast";
import { postCreation } from "@/actions/post.actions";
import MediaUpload from "../shared/UploadMedia";
import PostDialog from "../shared/AIDilalog";

function CreatePost() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  async function handleCreatePost() {
    if (!content.trim() && !mediaUrl) {
      errorToast("Please add content or media to create post!");
      return;
    }

    setIsPosting(true);
    try {
      const res = await postCreation(content, mediaUrl, mediaType); 
      if (res?.success) {
        setContent("");
        setMediaUrl("");
        setMediaType(null);
        setShowMediaUpload(false);
        successToast("Post created successfully!");
      }
    } catch (error) {
      console.log("Error creating post..", error);
      errorToast("Error creating post!");
    } finally {
      setIsPosting(false);
    }
  }


  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          {/* Text input */}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-muted-foreground text-xl font-semibold min-h-[120px] p-4"
            disabled={isPosting}
          />
      
          {showMediaUpload && (
            <MediaUpload
              endpoint="mediaUploader"
              value={mediaUrl}
              fileType={mediaType}
              onChange={(url, type) => {
                setMediaUrl(url);
                setMediaType(type as "image" | "video");
              }}
            />
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-[2px]" />
                {showMediaUpload ? "Remove" : "Photo/Video"}
              </Button>
          
             <PostDialog 
               trigger={
                <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={()=>{}}
              >
                <BotIcon className="size-4 mr-[2px]" />
                AI Writer
              </Button>
               }
               />
            </div>
            <Button
              className="flex items-center"
              onClick={handleCreatePost}
              disabled={(!content.trim() && !mediaUrl) || isPosting}
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
