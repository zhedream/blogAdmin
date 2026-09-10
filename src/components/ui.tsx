import { useEffect, useRef, type ReactNode } from 'react';
import { AlertCircle, FileText, X } from 'lucide-react';
export function Message({ children, success = false }: { children: ReactNode; success?: boolean }) { return <div className={`message ${success ? 'success' : ''}`} role={success ? 'status' : 'alert'}><AlertCircle size={18} />{children}</div>; }
export function Loading() { return <div className="empty" role="status"><span className="spinner" />正在加载内容…</div>; }
export function Empty({ title = '还没有内容', children }: { title?: string; children?: ReactNode }) { return <div className="empty"><div className="empty-icon"><FileText size={28} /></div><h3>{title}</h3>{children}</div>; }
export function Badge({ published }: { published: boolean }) { return <span className={`badge ${published ? 'published' : 'draft'}`}><span />{published ? '已发布' : '草稿'}</span>; }
export function date(value: string) { return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value)); }
export function Modal({ title, children, close, busy = false }: { title: string; children: ReactNode; close: () => void; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} aria-label={title} onCancel={e => { e.preventDefault(); if (!busy) close(); }}><div className="modal-head"><h2>{title}</h2><button className="icon-button" aria-label="关闭" onClick={close} disabled={busy}><X size={20} /></button></div>{children}</dialog>;
}
