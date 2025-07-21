"use client"

import { getNotifications, readNotifications } from "@/actions/notificatinons.action"
import { NotificationsSkeleton } from "@/components/shared/NotificationSkeleton"
import React, { useEffect, useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { errorToast } from "@/components/shared/Toast";


function Notificationspage() {
  type Notifications = Awaited<ReturnType<typeof getNotifications>>
  type Notification = NonNullable<Notifications>[number]
  
  const [notifications,setNotifications] = useState<Notification[]>()
  const [loading,setLoading] = useState(true)
 
  const unreadNotifications = notifications?.filter((n) => !n.read)
  const isRead = ((unreadNotifications ?? []).length > 0) ? true : false;


const getNotificationIcon = (type:string) =>{
   switch(type){
     case "LIKE":
       return <HeartIcon className="size-4"/>
     case "FOLLOW":
       return <UserPlusIcon className="size-4"/>
     case "COMMENT":
       return <MessageCircleIcon className="size-4"/>
     default:
       return <HeartIcon className="size-4"/>
   }
}

useEffect(()=>{
  const fetchNotifications = async () => {
    try{
      const notifications = await getNotifications()
      setNotifications(notifications)
       
      const unreadIds = notifications?.filter((n)=>!n.read).map((n)=>n.id)
      if((unreadIds ?? []).length > 0){
        await readNotifications(unreadIds ?? [])
      }
    }catch(error){
      console.log("Error getting notifications",error);
      errorToast("Error reading notifications right now")
    }finally{
      setLoading(false)
    }
  }
  fetchNotifications()
  },[])


  if (loading) return <NotificationsSkeleton/>
  
  return (
   <>
   <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notifications?.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {!isRead || notifications?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No new notifications yet</div>
            ) : (isRead && notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <Avatar className="mt-1">
                    <AvatarImage src={notification.creator.image ?? "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span>
                        <span className="font-medium">
                          {notification.creator.name ?? notification.creator.username}
                        </span>{" "}
                        {notification.type === "FOLLOW"
                          ? "started following you"
                          : notification.type === "LIKE"
                          ? "liked your post"
                          : "commented on your post"}
                      </span>
                    </div>

                    {notification.post &&
                      (notification.type === "LIKE" || notification.type === "COMMENT") && (
                        <div className="pl-6 space-y-2">
                          <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                            <p>{notification.post.content}</p>
                            {notification.post.mediaUrl && notification.post.mediaType === "image" && (
                              <img
                                src={notification.post.mediaUrl}
                                alt="Post content"
                                className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                              />
                            )}
                            {notification.post.mediaUrl && notification.post.mediaType === "video" && (
                              <video
                                src={notification.post.mediaUrl}
                                controls
                                className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                              />
                            )
                            }
                          </div>

                          {notification.type === "COMMENT" && notification.comment && (
                            <div className="text-sm p-2 bg-accent/50 rounded-md">
                              {notification.comment.content}
                            </div>
                          )}
                        </div>
                      )}
                    <p className="text-sm text-muted-foreground pl-6">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
   </>
  )
}

export default Notificationspage