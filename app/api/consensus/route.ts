import {NextRequest,NextResponse} from "next/server";
import {DEMO_ANSWERS,DEMO_SYNTHESIS} from "@/lib/demo";
import {callProvider,synthesize} from "@/lib/providers";
import type {ModelResult,Provider} from "@/lib/types";
export const runtime="nodejs";
const VALID:Provider[]=["openai","claude","gemini"];
function configured(p:Provider){return p==="openai"?!!process.env.OPENAI_API_KEY:p==="claude"?!!process.env.ANTHROPIC_API_KEY:!!process.env.GEMINI_API_KEY}
export async function POST(request:NextRequest){
 const started=Date.now();
 try{
  const body=await request.json();
  const prompt=typeof body.prompt==="string"?body.prompt.trim():"";
  const providers:Array<Provider>=Array.isArray(body.providers)?body.providers.filter((x:unknown):x is Provider=>VALID.includes(x as Provider)):[];
  const selected=[...new Set(providers)];
  if(prompt.length<3||prompt.length>2000)return NextResponse.json({error:"Prompt must contain between 3 and 2,000 characters."},{status:400});
  if(selected.length<2)return NextResponse.json({error:"Select at least two different models."},{status:400});
  const live=selected.every(configured);
  if(!live){
   await new Promise(r=>setTimeout(r,750));
   const responses:ModelResult[]=selected.map((provider,index)=>({provider,model:provider==="openai"?"GPT-4.1 mini":provider==="claude"?"Claude Sonnet 4":"Gemini 2.5 Flash",answer:DEMO_ANSWERS[provider],latencyMs:590+index*173}));
   return NextResponse.json({mode:"demo",responses,synthesis:DEMO_SYNTHESIS,evaluator:"Claude (simulated)",totalMs:Date.now()-started});
  }
  const settled=await Promise.allSettled(selected.map(p=>callProvider(p,prompt)));
  const responses:ModelResult[]=settled.map((result,index)=>result.status==="fulfilled"?result.value:{provider:selected[index],model:selected[index],error:result.reason instanceof Error?result.reason.message:"Provider failed",latencyMs:Date.now()-started});
  const successful=responses.filter((x):x is ModelResult&{answer:string}=>!!x.answer);
  if(successful.length<2)return NextResponse.json({error:"Fewer than two models returned an answer.",responses},{status:502});
  const final=await synthesize(prompt,successful);
  return NextResponse.json({mode:"live",responses,synthesis:final.text,evaluator:final.evaluator,totalMs:Date.now()-started});
 }catch(error){console.error(error);return NextResponse.json({error:"The engine could not complete this request."},{status:500})}
}
