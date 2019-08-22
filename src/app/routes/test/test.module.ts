import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { TestRoutingModule } from './test-routing.module';
import { HelloComponent } from './hello/hello.component';
import { CommonModule } from '@angular/common';
import { EditorMdDirective } from 'src/app/editor/editor-md.directive';
import { HtmlMdDirective } from 'src/app/editor/html-md.directive';
import { EditormdComponent } from './editormd/editormd.component';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TestRoutingModule,
    CommonModule,
  ],
  declarations: [
    // editor.md 指令
    EditorMdDirective, HtmlMdDirective,
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    HelloComponent,
    EditormdComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TestModule { }
