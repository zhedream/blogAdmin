import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { EditormdComponent } from './editormd/editormd.component';

const routes: Routes = [
  { path: 'hello', component: HelloComponent },
  { path: 'editor', component: EditormdComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
