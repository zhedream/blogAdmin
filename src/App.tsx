import { Suspense, lazy } from 'react';
import { NavLink, Outlet, createHashRouter, RouterProvider, Link, useRouteError } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Tags, PenLine, LogOut, ArrowUpRight } from 'lucide-react';
import { SessionProvider, useSession } from './session';
import Login from './pages/Login';
import { Loading } from './components/ui';
const Dashboard = lazy(()=>import('./pages/Dashboard'));
const Articles = lazy(()=>import('./pages/Articles'));
const Editor = lazy(()=>import('./pages/Editor'));
const Taxonomies = lazy(()=>import('./pages/Taxonomies'));
function Layout() {
  const { session, logout } = useSession();
  if (!session) return <Login/>;
  return <div className="app"><aside className="sidebar"><Link to="/" className="brand"><span className="brand-icon"><PenLine size={22}/></span><span>Blog<span className="brand-light"> Studio</span></span></Link><div className="workspace-label">内容工作空间 <span>PERSONAL</span></div><nav aria-label="主导航"><NavLink to="/" end><LayoutDashboard size={19}/>工作台</NavLink><NavLink to="/articles"><FileText size={19}/>文章管理</NavLink><NavLink to="/categories"><FolderOpen size={19}/>分类管理</NavLink><NavLink to="/tags"><Tags size={19}/>标签管理</NavLink></nav><div className="sidebar-note"><span>每一次记录，<br/>都是一次积累。</span><PenLine size={28}/><Link to="/articles/new">写下新想法 <ArrowUpRight size={16}/></Link></div><div className="account"><span className="avatar">Z</span><div><strong>管理员</strong><small>个人博客</small></div><button className="icon-button" title="退出登录" aria-label="退出登录" onClick={()=>{if(window.confirm('确认退出登录？请先保存正在编辑的内容。')) logout();}}><LogOut size={18}/></button></div></aside><div className="main-wrap"><header className="topbar"><span>工作空间 <span className="slash">/</span> 内容管理</span><span className="topbar-right"><span className="online-dot"/> 已验证身份 <span className="avatar small">Z</span></span></header><main id="main-content"><Suspense fallback={<Loading/>}><Outlet/></Suspense></main><footer className="footer">Blog Studio <span>把值得记录的，留在这里。</span></footer></div></div>;
}
function RouteError() { const error = useRouteError(); return <div className="empty"><h2>页面暂时无法打开</h2><p>{error instanceof Error ? error.message : '请重新打开页面'}</p><a href="/">回到工作台</a></div>; }
const router=createHashRouter([{element:<Layout/>,errorElement:<RouteError/>,children:[{index:true,element:<Dashboard/>},{path:'articles',element:<Articles/>},{path:'articles/new',element:<Editor/>},{path:'articles/:id',element:<Editor/>},{path:'categories',element:<Taxonomies key="categories" kind="categories"/>},{path:'tags',element:<Taxonomies key="tags" kind="tags"/>},{path:'*',element:<div className="empty"><h2>页面不存在</h2><Link to="/">回到工作台</Link></div>}]}]);
export default function App(){ return <SessionProvider><RouterProvider router={router}/></SessionProvider>; }
