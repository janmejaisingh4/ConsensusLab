import type { ModelResult, Provider } from "./types";

async function request(url:string, init:RequestInit){
  const response=await fetch(url,{...init,signal:AbortSignal.timeout(30000),cache:"no-store"});
  const json=await response.json();
  if(!response.ok) throw new Error(json?.error?.message||json?.message||"Provider request failed");
  return json;
}
export async function callProvider(provider:Provider,prompt:string):Promise<ModelResult>{
  const started=Date.now();
  if(provider==="openai"){
    const model="gpt-4.1-mini";
    const json=await request("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model,temperature:.7,messages:[{role:"system",content:"Answer accurately, clearly, and independently."},{role:"user",content:prompt}]})});
    return {provider,model,answer:json.choices[0].message.content,latencyMs:Date.now()-started};
  }
  if(provider==="claude"){
    const model="claude-sonnet-4-20250514";
    const json=await request("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY!,"anthropic-version":"2023-06-01"},body:JSON.stringify({model,max_tokens:1600,messages:[{role:"user",content:prompt}]})});
    return {provider,model,answer:json.content[0].text,latencyMs:Date.now()-started};
  }
  const model="gemini-2.5-flash";
  const key=encodeURIComponent(process.env.GEMINI_API_KEY!);
  const json=await request(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  return {provider,model,answer:json.candidates[0].content.parts.map((p:{text?:string})=>p.text||"").join(""),latencyMs:Date.now()-started};
}
function evaluatorPrompt(prompt:string,answers:ModelResult[]){
  const candidates=answers.map(x=>`[${x.provider}]\n${x.answer}`).join("\n\n");
  return `You are the evaluator in a self-consistency engine. Create one original refined answer. Check factual agreement, resolve contradictions, preserve clear reasoning, add missing nuance, and never mention the models or evaluation. Do not copy a single candidate.\n\nQUESTION:\n${prompt}\n\nCANDIDATES:\n${candidates}`;
}
export async function synthesize(prompt:string,answers:ModelResult[]){
  const instruction=evaluatorPrompt(prompt,answers);
  if(process.env.ANTHROPIC_API_KEY){
    try{const json=await request("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:instruction}]})});return {text:json.content[0].text,evaluator:"Claude Sonnet 4"};}catch{}
  }
  if(process.env.OPENAI_API_KEY){
    const json=await request("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:"gpt-4.1-mini",temperature:.25,messages:[{role:"user",content:instruction}]})});
    return {text:json.choices[0].message.content,evaluator:"GPT-4.1 mini"};
  }
  throw new Error("No evaluator configured");
}
