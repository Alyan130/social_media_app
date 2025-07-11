import { getPosts } from "@/actions/post.actions";
import { getDbUserId } from "@/actions/user.actions";
import PostCard from "@/components/shared/PostCard";
import CreatePost from "@/components/widget/CreatePost";
import Follow from "@/components/widget/Follow";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { PodcastIcon } from "lucide-react";

type Posts = Awaited<ReturnType<typeof getPosts>>;

export default async function Home() {

 const user =  await currentUser()
 const posts:Posts =  await getPosts(); 
 const userId = await getDbUserId()


  return (
  <main className="grid grid-cols-1 lg:grid-cols-10 gap-5">
    <div className="lg:col-span-6">
     { user ? <CreatePost/> : <PodcastIcon size={40}/> }

     <div className="space-y-6">
   {posts?.map(post=><PostCard key={post.id} post={post} dbUserId={userId}/>)}
    </div>
    </div>

    <div className="hidden lg:block lg:col-span-4 sticky top-20">
      <Follow/>
    </div>
  </main>
  )
}


