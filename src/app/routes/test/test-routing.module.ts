import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { EditormdComponent } from './editormd/editormd.component';
import { ApolloComponent } from './apollo/apollo.component';

const routes: Routes = [
  { path: 'hello', component: HelloComponent },
  { path: 'editor', component: EditormdComponent },
  { path: 'apollo', component: ApolloComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
