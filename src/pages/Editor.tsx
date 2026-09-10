import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Code2, Save, Send, PanelLeftClose } from 'lucide-react';
import { operations, type Article, type Taxonomy } from '../api';
import { useQuery, useSession } from '../session';
import { Message, Loading, Modal } from '../components/ui';
import { renderMarkdown } from '../markdown';
interface Draft { title: string; desc: string; md: string; isPublished: boolean; typeId: string; tagIds: string[] }
const blank: Draft = {title:'',desc:'',md:'',isPublished:false,typeId:'',tagIds:[]};
export default function Editor(){ const {id}=useParams(); return <EditorForm key={id||'new'} id={id}/>; }
function EditorForm({id}:{id?:string}) {
  const {api,session}=useSession(); const navigate=useNavigate();
  const [draft,setDraft]=useState<Draft>(blank);const [saved,setSaved]=useState(JSON.stringify(blank));const [loading,setLoading]=useState(!!id);const [loadError,setLoadError]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [success,setSuccess]=useState('');const [mode,setMode]=useState<'split'|'write'|'preview'>('split');
  const [recovery,setRecovery]=useState<Draft|null>(null);const [localSaved,setLocalSaved]=useState(false);const textRef=useRef<HTMLTextAreaElement>(null);const allowLeave=useRef(false);
  const dirty=JSON.stringify(draft)!==saved;
  const draftKey=`blog-studio-draft:${session?.endpoint}:${id||'new'}`;
  const taxonomy=useQuery<{tags:Taxonomy[];categories:Taxonomy[]}>(operations.taxonomy);
  const blocker=useBlocker(()=>dirty&&!allowLeave.current);
  useEffect(()=>{
    const controller=new AbortController();
    if(id) api<{article:Article|null}>(operations.article,{where:{id}},controller.signal).then(({article})=>{
      if(!article)throw new Error('文章不存在或已被删除');
      const value={title:article.title,desc:article.desc||'',md:article.md||'',isPublished:article.isPublished,typeId:article.type?.id||'',tagIds:article.tags.map(t=>t.id)};setDraft(value);setSaved(JSON.stringify(value));
    }).catch(e=>{if(!controller.signal.aborted)setLoadError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    try{const cached=JSON.parse(sessionStorage.getItem(draftKey)||'null');if(cached&&typeof cached.title==='string'&&typeof cached.md==='string'&&typeof cached.desc==='string'&&Array.isArray(cached.tagIds))setRecovery(cached);}catch{/* Ignore invalid cache. */}
    return ()=>controller.abort();
  },[id,api,draftKey]);
  useEffect(()=>{const onLeave=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',onLeave);return()=>window.removeEventListener('beforeunload',onLeave);},[dirty]);
  useEffect(()=>{if(!dirty||loading)return;setLocalSaved(false);const timer=setTimeout(()=>{try{sessionStorage.setItem(draftKey,JSON.stringify(draft));setLocalSaved(true);}catch{setLocalSaved(false);}},650);return()=>clearTimeout(timer);},[draft,dirty,loading,draftKey]);
  const rendered=useMemo(()=>renderMarkdown(draft.md),[draft.md]);
  function change<K extends keyof Draft>(key:K,value:Draft[K]){setDraft(d=>({...d,[key]:value}));setSuccess('');}
  async function save(published: boolean){
    if(!draft.title.trim()||!draft.md.trim()){setError('请填写文章标题与正文');return;}
    setBusy(true);setError('');setSuccess('');
    const next={...draft,title:draft.title.trim(),isPublished:published};
    const data={...next,typeId:next.typeId||null,...rendered};
    try{
      if(id){await api(operations.update,{where:{id},data});setDraft(next);setSaved(JSON.stringify(next));setSuccess(published?'文章已发布':'草稿已保存');}
      else{const result=await api<{createArticle:{id:string}}>(operations.create,{data});allowLeave.current=true;navigate(`/articles/${result.createArticle.id}`,{replace:true});}
      try{sessionStorage.removeItem(draftKey);}catch{/* Optional storage. */}setRecovery(null);
    }catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  function insert(before:string,after=''){const el=textRef.current;if(!el)return;const start=el.selectionStart,end=el.selectionEnd;change('md',draft.md.slice(0,start)+before+draft.md.slice(start,end)+after+draft.md.slice(end));requestAnimationFrame(()=>{el.focus();el.setSelectionRange(start+before.length,end+before.length);});}
  if(loading)return <Loading/>;
  if(loadError)return <Message>{loadError}<Link to="/articles">返回文章列表</Link></Message>;
  return <><div className="editor-heading"><div><Link className="back-link" to="/articles"><ArrowLeft size={17}/>文章管理</Link><h1>{id?'编辑文章':'写一篇新文章'}</h1></div><div className="editor-actions"><span className="save-status">{dirty?(localSaved?'已暂存到此标签页':'有未保存修改'):'内容已同步'}</span><button className="button" disabled={busy} onClick={()=>save(false)}><Save size={17}/>{busy?'保存中…':'保存草稿'}</button><button className="button primary" disabled={busy} onClick={()=>save(true)}><Send size={17}/>{draft.isPublished?'更新发布':'发布文章'}</button></div></div>{error&&<Message>{error}</Message>}{success&&<Message success>{success}</Message>}{recovery&&<Message>发现此标签页中未保存的内容。<button onClick={()=>{setDraft(recovery);setRecovery(null);}}>恢复暂存</button><button onClick={()=>{sessionStorage.removeItem(draftKey);setRecovery(null);}}>忽略</button></Message>}<div className="editor-grid"><section className="panel editor-main"><label className="title-field"><span className="sr-only">文章标题</span><input value={draft.title} onChange={e=>change('title',e.target.value)} placeholder="给这个想法起个标题…" maxLength={200} disabled={busy}/></label><div className="editor-toolbar"><div className="format-tools"><button aria-label="插入标题" onClick={()=>insert('## ')} disabled={busy||mode==='preview'}>H₂</button><button aria-label="加粗" onClick={()=>insert('**','**')} disabled={busy||mode==='preview'}><b>B</b></button><button aria-label="斜体" onClick={()=>insert('*','*')} disabled={busy||mode==='preview'}><i>I</i></button><button aria-label="插入链接" onClick={()=>insert('[','](https://)')} disabled={busy||mode==='preview'}>↗</button><button aria-label="插入代码块" onClick={()=>insert('\n```\n','\n```\n')} disabled={busy||mode==='preview'}><Code2 size={17}/></button></div><div className="mode-tabs">{[{key:'write',label:'编辑',icon:Code2},{key:'split',label:'分屏',icon:PanelLeftClose},{key:'preview',label:'预览',icon:Eye}].map(({key,label,icon:Icon})=><button key={key} className={mode===key?'active':''} aria-pressed={mode===key} onClick={()=>setMode(key as typeof mode)}><Icon size={15}/>{label}</button>)}</div></div><div className={`writing-area ${mode}`}>{mode!=='preview'&&<textarea ref={textRef} aria-label="Markdown 正文" value={draft.md} onChange={e=>change('md',e.target.value)} placeholder={'从这里开始你的记录…\n\n支持 Markdown 语法，右侧实时预览。'} spellCheck={false} disabled={busy}/ >}{mode!=='write'&&<article className="markdown-preview" aria-label="文章预览" dangerouslySetInnerHTML={{__html:rendered.html||'<p class="muted">你的内容将在这里呈现。</p>'}}/>}</div><div className="editor-bottom"><span>Markdown</span><span>{draft.md.length.toLocaleString()} 字符</span></div></section><aside className="editor-settings"><section className="panel panel-body"><h2>文章设置</h2><label>摘要<textarea value={draft.desc} onChange={e=>change('desc',e.target.value)} placeholder="用几句话介绍这篇文章…" rows={4} maxLength={1000} disabled={busy}/></label><p className="field-hint">展示在博客的文章列表中。</p>{taxonomy.error?<Message>{taxonomy.error}<button onClick={taxonomy.reload}>重试</button></Message>:<><label>分类<select value={draft.typeId} onChange={e=>change('typeId',e.target.value)} disabled={busy||taxonomy.loading}><option value="">未分类</option>{taxonomy.data?.categories.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label><fieldset className="tag-fieldset" disabled={busy||taxonomy.loading}><legend>标签</legend><div className="tag-options">{taxonomy.data?.tags.map(tag=><label key={tag.id} className={draft.tagIds.includes(tag.id)?'chosen':''}><input type="checkbox" checked={draft.tagIds.includes(tag.id)} onChange={e=>change('tagIds',e.target.checked?[...draft.tagIds,tag.id]:draft.tagIds.filter(id=>id!==tag.id))}/>{tag.name}</label>)}</div>{!taxonomy.data?.tags.length&&<small className="muted">可在标签管理中新建标签。</small>}</fieldset></>}</section><div className="editor-note"><span>专注内容，慢慢打磨</span><p>草稿不会公开展示。点击「发布文章」，让读者看到你的新记录。</p><small>此标签页会暂存未保存内容；关闭标签页前，请保存到服务器。</small></div></aside></div>{blocker.state==='blocked'&&<Modal title="离开编辑页面？" busy={busy} close={()=>blocker.reset()}><p className="modal-copy">还有修改未保存到服务器。你可以继续编辑，或放弃本次修改。</p><div className="modal-actions"><button className="button" onClick={()=>blocker.reset()}>继续编辑</button><button className="button danger" onClick={()=>blocker.proceed()}>离开页面</button></div></Modal>}</>;
}
