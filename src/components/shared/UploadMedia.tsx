"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

interface MediaUploadProps {
  onChange: (fileUrl: string, fileType: string) => void;
  value: string;
  fileType?: "image" | "video"| null;
  endpoint: "mediaUploader";
}

function MediaUpload({ endpoint, onChange, value, fileType }: MediaUploadProps) {
  const handleClear = () => {
    onChange("", ""); 
  };

  if (value) {
    return (
      <div className="relative h-52 w-full rounded-md overflow-hidden">
        {fileType === "image" ? (
          <img
            src={value}
            alt="Uploaded media"
            className="object-cover w-full h-full"
          />
        ) : (
          <video
            src={value}
            controls
            className="object-cover w-full h-full"
          />
        )}
        <button
          onClick={handleClear}
          className="absolute top-1 right-1 p-1 bg-purple-600 rounded-full shadow-sm z-10"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }


  return (
    <UploadDropzone
    className="h-52 pb-3"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        
        if (!res?.[0]) return;
        const uploadedFile = res[0];
        console.log("uploaded file:", uploadedFile);
        
        const url = uploadedFile.serverData.fileUrl || uploadedFile.url;
        const type = uploadedFile.serverData.fileType || (uploadedFile.type.startsWith("video/") ? "video" : "image");  

        onChange(url, type);
        console.log("URL AFTER:", url);
        console.log("type:", type);
        console.log("Full response:", uploadedFile);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload Error:", error);
      }}
    />
  );
}

export default MediaUpload;
