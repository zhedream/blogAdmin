import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ArticleRoutingModule } from './article-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
// editor
import { CommonModule } from '@angular/common';
import { EditorMdDirective } from 'src/app/editor/editor-md.directive';
import { HtmlMdDirective } from 'src/app/editor/html-md.directive';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule,
    CommonModule
  ],
  declarations: [
    // editor
    EditorMdDirective, HtmlMdDirective,
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    IndexComponent,
    AddComponent,
    EditComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ArticleModule { }
