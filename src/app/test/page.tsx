"use client"

import PostDialog from '@/components/shared/AIDilalog'
import { Button } from '@/components/ui/button'
import React from 'react'

function page() {
  return (
    <div>
        <PostDialog
               trigger={
                <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={()=>{}}
              >
                <Button className="size-4 mr-[2px]" />
                AI Writer
              </Button>
               }
            />
    </div>
  )
}

export default page