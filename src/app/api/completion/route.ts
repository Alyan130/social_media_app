import {streamText} from "ai"
import {google} from "@ai-sdk/google"
import { socialPrompt } from "@/lib/prompt";


export async function POST(req:Request){
   
const {prompt}:{prompt:string}  = await req.json();

const result  = await streamText({
    model:google("gemini-2.0-flash"),
    system:socialPrompt,
    prompt,
})

return result.toDataStreamResponse()
}
