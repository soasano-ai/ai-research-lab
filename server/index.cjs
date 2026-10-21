// Railway Node 20+ server. Environment: OPENAI_API_KEY, ANTHROPIC_API_KEY, LAB_ACCESS_TOKEN, ALLOWED_ORIGIN, PORT.
const http=require('node:http');
const crypto=require('node:crypto');
const PORT=Number(process.env.PORT||3000);
const origin=process.env.ALLOWED_ORIGIN||'https://soasano-ai.github.io';
const access=process.env.LAB_ACCESS_TOKEN||'';
const limits=new Map();
const allowedModels={openai:process.env.OPENAI_MODEL||'gpt-4.1-mini',anthropic:process.env.ANTHROPIC_MODEL||'claude-sonnet-4-5'};
const modes={
 teacher:'初心者向けの先生。専門用語を平易に説明し、具体例を示し、不確実なことは明示する。',
 english:'英語の学習コーチ。英文の品詞、文脈での意味、その他の主要な意味、例文を示す。使用頻度順位を根拠なく断定しない。',
 research:'研究指導者。問い、仮説、評価指標、限界を明確にする。',
 general:'丁寧かつ簡潔に質問に答える。'
};
function json(res,code,data){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':origin,'Vary':'Origin','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))}
function secretMatches(given){if(!access||!given)return false;const a=Buffer.from(access),b=Buffer.from(given);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
const server=http.createServer(async(req,res)=>{
 if(req.url==='/health'&&req.method==='GET')return json(res,200,{ok:true});
 if(req.method==='OPTIONS'&&req.url==='/api/chat'){res.writeHead(204,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Vary':'Origin'});return res.end()}
 if(req.url!=='/api/chat'||req.method!=='POST')return json(res,404,{error:'Not found'});
 if(req.headers.origin&&req.headers.origin!==origin)return json(res,403,{error:'Origin not allowed'});
 if(!secretMatches((req.headers.authorization||'').replace(/^Bearer /,'')))return json(res,401,{error:'Access token is invalid'});
 const ip=(req.socket.remoteAddress||'unknown'),now=Date.now(),entry=limits.get(ip)||{start:now,count:0};if(now-entry.start>60000){entry.start=now;entry.count=0}entry.count++;limits.set(ip,entry);if(limits.size>10000)for(const [k,v] of limits)if(now-v.start>60000)limits.delete(k);
 if(entry.count>12)return json(res,429,{error:'Rate limit exceeded'});
 let raw='';try{for await(const chunk of req){raw+=chunk;if(raw.length>40000)throw Error('Request too large')}}catch(e){return json(res,413,{error:'Request too large'})}
 let data;try{data=JSON.parse(raw)}catch(e){return json(res,400,{error:'Invalid JSON'})}
 const {provider,mode,task,messages}=data;
 if(!Object.hasOwn(allowedModels,provider)||!Object.hasOwn(modes,mode)||!['chat','summary'].includes(task)||!Array.isArray(messages)||!messages.length||messages.length>30||messages.some(m=>!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>4000))return json(res,400,{error:'Invalid request'});
 const key=provider==='openai'?process.env.OPENAI_API_KEY:process.env.ANTHROPIC_API_KEY;
 if(!key)return json(res,503,{error:provider+' API is not configured'});
 const context=task==='summary'?'会話を日本語で、結論、学んだこと、重要用語、未解決の疑問、次の行動の見出しで簡潔に要約する。会話内容にないことを追加しない。':modes[mode];
 let url,headers,payload;
 if(provider==='openai'){
 url='https://api.openai.com/v1/chat/completions';headers={'Content-Type':'application/json','Authorization':'Bearer '+key};
 payload={model:allowedModels.openai,max_completion_tokens:700,messages:[{role:'system',content:context},...messages]};
 }else{
 url='https://api.anthropic.com/v1/messages';headers={'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'};
 const chat=messages[0].role==='assistant'?[{role:'user',content:'会話を開始します。'},...messages]:messages;
 payload={model:allowedModels.anthropic,max_tokens:700,system:context,messages:chat};
 }
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
 try{const response=await fetch(url,{method:'POST',headers,body:JSON.stringify(payload),signal:controller.signal});const result=await response.json();if(!response.ok){console.error('Provider error',provider,response.status);return json(res,502,{error:'AI provider returned an error (HTTP '+response.status+')'})}const answer=provider==='openai'?result.choices?.[0]?.message?.content:result.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n');if(typeof answer!=='string'||!answer)return json(res,502,{error:'Empty AI response'});return json(res,200,{text:answer})}catch(e){console.error('AI gateway error',e.name);return json(res,502,{error:'AI connection failed'})}finally{clearTimeout(timeout)}
});
server.listen(PORT,'0.0.0.0',()=>console.log('AI gateway listening on '+PORT));
