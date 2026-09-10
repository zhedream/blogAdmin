import { useState, type FormEvent } from 'react';
import { ArrowRight, LockKeyhole, PenLine, ShieldCheck } from 'lucide-react';
import { defaultEndpoint, operations, request, validateEndpoint } from '../api';
import { useSession } from '../session';
import { Message } from '../components/ui';
export default function Login() {
  const { login } = useSession();
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [token, setToken] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try { const session = { endpoint: validateEndpoint(endpoint.trim()), token: token.trim(), expiresAt: Date.now() + 8 * 3600000 }; const data = await request<{ adminSession: boolean }>(session, operations.session); if (!data.adminSession) throw new Error('管理密钥无效'); login(session); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <div className="login-page"><div className="login-story"><a className="brand" href="#/"><span className="brand-icon"><PenLine size={23} /></span><span>Blog<span className="brand-light"> Studio</span></span></a><div><span className="eyebrow">YOUR IDEAS, WELL KEPT.</span><h1>让想法落笔，<br/>让内容生长。</h1><p>一个安静、有序的空间。<br/>记录思考，整理知识，发布你的下一篇文章。</p><div className="story-art"><div className="art-line"/><div className="art-line short"/><div className="art-note">好内容，从一个想法开始。<span>✦</span></div><div className="art-line"/></div></div><small>ZHEDREAM / CONTENT WORKSPACE</small></div><main className="login-main"><form onSubmit={submit} className="login-card"><div className="login-lock"><LockKeyhole size={26}/></div><span className="eyebrow">WELCOME BACK</span><h2>回到你的创作空间</h2><p className="muted">验证管理员身份，开始管理博客内容。</p>{error && <Message>{error}</Message>}<label>管理密钥<input type="password" name="password" autoComplete="current-password" required value={token} onChange={e=>setToken(e.target.value)} placeholder="输入管理员密钥" disabled={busy}/></label><details open={!import.meta.env.VITE_GRAPHQL_ENDPOINT}><summary>服务连接设置</summary><label>GraphQL 服务地址<input type="text" value={endpoint} onChange={e=>setEndpoint(e.target.value)} required disabled={busy} spellCheck={false}/></label></details><button className="button primary login-submit" disabled={busy}>{busy ? '正在验证…' : '进入工作台'}<ArrowRight size={18}/></button><p className="login-hint"><ShieldCheck size={16}/>登录仅保留在当前标签页，8 小时后自动退出。</p></form><small className="login-footer">Blog Studio · 用心记录，自在表达</small></main></div>;
}
