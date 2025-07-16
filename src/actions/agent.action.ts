"use server"

import {Agent, run} from "@openai/agents"
import {aisdk} from "@openai/agents-extensions"
import { engagingPrompt, informativePrompt, promotePrompt } from "@/agent/prompts"
import { createGoogleGenerativeAI } from "@ai-sdk/google"


interface PostData {
    title: string;
    description: string;
    keywords: string[];
  }

if(!process.env.GOOGLE_GENERATIVE_AI_API_KEY){
    console.log(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY);
   throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY")
}

const google = createGoogleGenerativeAI({
    baseURL:"https://generativelanguage.googleapis.com/v1beta.",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
})

const model = aisdk(google("gemini-2.0-flash"))


const promoteAgent = new Agent({
    name:"Promote Agent",
    instructions:promotePrompt,
    model:model,
    handoffDescription:"I am expert in promoting posts"
})

const engagingAgent = new Agent({
    name:"Infomative Agent",
    instructions:engagingPrompt,
    model:model,
    handoffDescription:"I am expert in engaging posts"
})

const informativeAgent = new Agent({
    name:"Infomative Agent",
    instructions:informativePrompt,
    model:model,
    handoffs:[engagingAgent,promoteAgent]
})


export async function runAgent(formdata:PostData){
    
    const prompt = `
     Post title: ${formdata.title}
     Post description: ${formdata.description}
     Post keywords: ${formdata.keywords.join(", ")}
    `
    try {
        const prompt = `
         Post title: ${formdata.title}
         Post description: ${formdata.description}
         Post keywords: ${formdata.keywords.join(", ")}
        `;
        
        const result = await run(informativeAgent, prompt);
        return { success: true, result: result.finalOutput || "No output generated" };
    } catch (error) {
        console.error('Error running agent:', error);
        return { success: false, error: 'Failed to generate post content' };
    }
}


