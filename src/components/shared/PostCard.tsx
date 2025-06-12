import React from 'react'

function PostCard({postdata}:{postdata:any}) {
  return (
    <>
    <h1>{postdata.content}</h1>
    </>
  )
}

export default PostCard