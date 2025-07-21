'use client';

import { Button } from '@/components/ui/button';
import { useCompletion } from '@ai-sdk/react';

export default function Page() {

  const { completion, complete } = useCompletion({
    api: 'http://localhost:3000/api/completion',
  });
  

  return (
    <div className='flex flex-col space-y-6'>
      <Button
        onClick={async ()=>{
          try{
           let result = await complete('Why is the sky blue?');
           console.log(result);
          }catch(e){
            console.log(e);
          }
        }}
        className='max-w-24'
      >
        generate
        </Button>
        <div className='w-80 bg-slate-300 text-black p-2 py-10'>
        {completion}
        </div>
    </div>
  );
}