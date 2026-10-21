/* AI Research Lab global AI chat - no API secrets in source. */
(function(){
'use strict';
const host=document.createElement('div');host.id='arl-ai-chat-host';
const css=document.createElement('style');css.textContent=`
#arl-ai-chat-host{font:14px/1.5 system-ui,sans-serif;color:#eaf4ff}#arl-ai-chat-host *{box-sizing:border-box}
.arl-chat-fab{position:fixed;right:18px;bottom:18px;z-index:100004;border:0;background:#53d7be;color:#092c35;border-radius:99px;box-shadow:0 8px 28px #0008;padding:13px 19px;font-weight:800;cursor:pointer}
.arl-chat-panel{position:fixed;z-index:100005;right:16px;bottom:78px;width:min(420px,calc(100vw - 24px));height:min(680px,calc(100dvh - 100px));background:#101f33;color:#eaf4ff;border:1px solid #50708c;border-radius:16px;box-shadow:0 20px 55px #000a;display:flex;flex-direction:column;overflow:hidden}
.arl-chat-panel[hidden]{display:none}.arl-chat-head{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;background:#1d3b51;gap:8px}.arl-chat-head strong{font-size:16px}.arl-chat-head button,.arl-chat-bar button{border:1px solid #577c96;background:#244258;color:#fff;border-radius:8px;padding:7px 10px;cursor:pointer}
.arl-chat-config{padding:9px 12px;display:grid;grid-template-columns:1fr 1fr;gap:7px;border-bottom:1px solid #426079}
.arl-chat-config input,.arl-chat-config select,.arl-chat-compose textarea{width:100%;background:#0b1b2d;color:#fff;border:1px solid #607e98;border-radius:8px;padding:9px;font:inherit}
.arl-chat-config .wide{grid-column:1/-1}.arl-chat-config label{font-size:12px;color:#b8d5e2}.arl-chat-messages{padding:12px;flex:1;overflow:auto;display:flex;flex-direction:column;gap:8px}
.arl-chat-msg{white-space:pre-wrap;overflow-wrap:anywhere;max-width:92%;border-radius:11px;padding:10px 12px;background:#254154;align-self:flex-start}.arl-chat-msg.user{background:#23635b;align-self:flex-end}
.arl-chat-compose{padding:10px;border-top:1px solid #4c6a82}.arl-chat-compose textarea{min-height:54px;max-height:110px;resize:vertical}
.arl-chat-bar{padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}.arl-chat-status{font-size:12px;color:#c1dce5;padding:0 12px 7px}.arl-chat-help{font-size:12px;line-height:1.4;color:#c0d3df;padding:5px 12px}.arl-chat-panel button:focus-visible,.arl-chat-panel input:focus-visible,.arl-chat-panel select:focus-visible,.arl-chat-panel textarea:focus-visible,.arl-chat-fab:focus-visible{outline:3px solid #ffdf87;outline-offset:2px}
@media(max-width:520px){.arl-chat-panel{right:6px;bottom:68px;width:calc(100vw - 12px);height:calc(100dvh - 80px)}.arl-chat-fab{right:12px;bottom:9px}}
`;document.head.appendChild(css);
const fab=document.createElement('button');fab.type='button';fab.className='arl-chat-fab';fab.textContent='AIに質問';fab.setAttribute('aria-label','AIチャットを開く');
host.innerHTML=`<section class="arl-chat-panel" role="dialog" aria-label="AIチャット" hidden>
<div class="arl-chat-head"><strong>AI Research Lab | チャット</strong><button type="button" id="arl-close" aria-label="チャットを閉じる">×</button></div>
<div class="arl-chat-config"><label>AIモデル<select id="arl-provider"><option value="openai">GPT</option><option value="anthropic">Claude</option></select></label><label>学習モード<select id="arl-mode"><option value="teacher">初心者の先生</option><option value="english">英語コーチ</option><option value="research">研究相談</option><option value="general">通常</option></select></label>
<label class="wide">APIサーバーURL<input id="arl-endpoint" type="url" placeholder="https://YOUR-API.example.com" autocomplete="url"></label>
<label class="wide">接続用トークン（このタブの間だけ保持）<input id="arl-token" type="password" placeholder="サーバーで設定したアクセス用トークン" autocomplete="off"></label></div>
<div class="arl-chat-help">ラボ内でのAI会話には、別途APIサーバーの設定が必要です。秘密のOpenAI/Anthropic APIキーは入力しないでください。</div>
<div class="arl-chat-messages" id="arl-messages" aria-live="polite"></div>
<form class="arl-chat-compose" id="arl-chat-form"><textarea id="arl-prompt" maxlength="4000" placeholder="ここから質問できます"></textarea><div class="arl-chat-bar"><button type="submit" id="arl-send">送信</button><button type="button" id="arl-summary">会話を要約</button><button type="button" id="arl-md">Obsidian用に保存</button><button type="button" id="arl-clear">履歴削除</button></div></form>
<div class="arl-chat-status" id="arl-status" role="status"></div></section>`;
host.appendChild(fab);
function start(){document.body.appendChild(host);const $=id=>host.querySelector('#'+id), panel=host.querySelector('.arl-chat-panel');let messages=[],summary='',busy=false;
try{const v=JSON.parse(sessionStorage.getItem('arl_chat_v1')||'[]');if(Array.isArray(v))messages=v.filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string').slice(-30)}catch(e){}
$('arl-endpoint').value=sessionStorage.getItem('arl_api_url')||'';$('arl-token').value=sessionStorage.getItem('arl_access_token')||'';
function store(){sessionStorage.setItem('arl_chat_v1',JSON.stringify(messages.slice(-30)))}
function show(){const out=$('arl-messages');out.replaceChildren();messages.forEach(m=>{const div=document.createElement('div');div.className='arl-chat-msg'+(m.role==='user'?' user':'');div.textContent=m.content;out.append(div)});out.scrollTop=out.scrollHeight}
function status(s){$('arl-status').textContent=s}
fab.onclick=()=>{panel.hidden=!panel.hidden;fab.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden){show();$('arl-prompt').focus()}};$('arl-close').onclick=()=>{panel.hidden=true;fab.focus()};
function settings(){const raw=$('arl-endpoint').value.trim();let url;try{url=new URL(raw)}catch(e){throw Error('正しいAPIサーバーURLを入力してください')};if(url.protocol!=='https:'&&!(['localhost','127.0.0.1'].includes(url.hostname)&&url.protocol==='http:'))throw Error('HTTPSのURLを指定してください');if(url.username||url.password||url.search||url.hash)throw Error('URLにはホスト名だけを指定してください');const token=$('arl-token').value.trim();if(!token)throw Error('接続トークンが必要です');sessionStorage.setItem('arl_api_url',url.origin);sessionStorage.setItem('arl_access_token',token);return {url:url.origin,token}}
async function ask(task,items){const s=settings(),controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);try{const res=await fetch(s.url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.token},body:JSON.stringify({provider:$('arl-provider').value,mode:$('arl-mode').value,task,messages:items}),signal:controller.signal});const body=await res.json().catch(()=>({}));if(!res.ok)throw Error(body.error||'HTTP '+res.status);if(typeof body.text!=='string')throw Error('回答が不正です');return body.text}finally{clearTimeout(timeout)}}
$('arl-chat-form').onsubmit=async e=>{e.preventDefault();if(busy)return;const input=$('arl-prompt').value.trim();if(!input)return;const outgoing=messages.concat({role:'user',content:input});busy=true;$('arl-send').disabled=true;status('回答を取得中…');try{const text=await ask('chat',outgoing);messages=outgoing.concat({role:'assistant',content:text}).slice(-30);store();$('arl-prompt').value='';summary='';show();status('回答を表示しました')}catch(err){status('送信失敗：'+err.message)}finally{busy=false;$('arl-send').disabled=false}};
$('arl-summary').onclick=async()=>{if(busy||!messages.length){status('要約する会話がありません');return}busy=true;status('会話を要約中…');try{summary=await ask('summary',messages);const d=document.createElement('div');d.className='arl-chat-msg';d.textContent='【要約】\n'+summary;$('arl-messages').append(d);status('要約が完成しました。Markdownで保存できます')}catch(err){status('要約失敗：'+err.message)}finally{busy=false}};
function download(name,text){const blob=new Blob([text],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
$('arl-md').onclick=()=>{if(!messages.length){status('保存する会話がありません');return}const ts=new Date(),day=ts.toISOString().slice(0,10),safe=s=>s.replaceAll('\\','\\\\').replaceAll('---','—');const log=messages.map(m=>'### '+(m.role==='user'?'質問':'回答')+'\n\n'+safe(m.content)).join('\n\n');const body='# AIチャット 学習ノート\n\n- 作成日時: '+ts.toLocaleString('ja-JP')+'\n- モデル: '+$('arl-provider').selectedOptions[0].textContent+'\n- 学習モード: '+$('arl-mode').selectedOptions[0].textContent+'\n\n## 要約\n\n'+(summary||'未作成（「会話を要約」で生成できます）')+'\n\n## 会話ログ\n\n'+log+'\n';download('AI_Lab_Chat_'+day+'.md',body);status('Markdownをダウンロードしました。Obsidian Vaultへの取り込みが必要です。')};
$('arl-clear').onclick=()=>{if(!confirm('このタブの会話履歴を削除しますか？'))return;messages=[];summary='';store();show();status('会話履歴を削除しました')};show()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
