import { Loader2Icon } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <>
    <div className='min-h-screen flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center space-y-2'>
        <Loader2Icon className='size-16 animate-spin text-muted-foreground'/>
       <h2 className='text-xl font-semibold text-muted-foreground'>Loading...</h2>
      </div>
    </div>
    </>
  )
}

export default loading