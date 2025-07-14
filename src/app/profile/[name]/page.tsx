import { getProfileByUser, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import ProfilePageClient from "@/components/ProfilePageClient"


export async function generateMetadata({params}:{params:{name:string}}) {
  
  const username = await getProfileByUser(params.name)

  if(!username) return
  return {
    title: username.name,
  }
}

async function page({params}:{params:{name:string}}) {

const username = params.name
const user = await getProfileByUser(username)

if(!user) return <div>User not found</div>

 const [posts, likedPosts, isfollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id)
  ])

  console.log(posts, likedPosts, isfollowing);
  

  return (
  <>
  <ProfilePageClient 
    user={user}
    posts={posts}
    likedPosts={likedPosts}
    isfollowing={isfollowing}
    />
  </>
    )
}

export default page