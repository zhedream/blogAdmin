import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'dashboard/workplace', pathMatch: 'full' },
      // { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' }, 
      // { path: 'dashboard/v1', component: DashboardV1Component },  // 默认页面
      // { path: 'dashboard/analysis', component: DashboardAnalysisComponent }, // 分析
      // { path: 'dashboard/monitor', component: DashboardMonitorComponent }, //监控
      { path: 'dashboard/workplace', component: DashboardWorkplaceComponent }, // 工作台
      { path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule) }, // 测试模块
      // {path: 'widgets',loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule)}, // 小部件
      // { path: 'style', loadChildren: () => import('./style/style.module').then(m => m.StyleModule) }, // 快捷菜单
      // { path: 'delon', loadChildren: () => import('./delon/delon.module').then(m => m.DelonModule) }, // Delon 类库
      // { path: 'extras', loadChildren: () => import('./extras/extras.module').then(m => m.ExtrasModule) }, // 拓展
      // { path: 'pro', loadChildren: () => import('./pro/pro.module').then(m => m.ProModule) }, // pro 页
      // Exception
      { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) }, // 异常页
    ],
  },
  // 全屏布局
  {
    path: 'data-v',
    component: LayoutFullScreenComponent,
    children: [{ path: '', loadChildren: () => import('./data-v/data-v.module').then(m => m.DataVModule) }],
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'app.login.login' },
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册', titleI18n: 'app.register.register' },
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果', titleI18n: 'app.register.register' },
      },
      {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '锁屏', titleI18n: 'app.lock' },
      },
    ],
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
