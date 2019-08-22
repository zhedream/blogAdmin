import { AfterViewInit, Attribute, Directive, EventEmitter, Input, Output } from '@angular/core';
import { EditorConfig } from './editor-config';

declare var editormd: any;
declare var $: any;

@Directive({
  selector: '[appHtmlMd]'
})
export class HtmlMdDirective implements AfterViewInit {
  @Input() config: EditorConfig; // 配置选项
  // @Output() onEditorChange: EventEmitter<string> = new EventEmitter<string>(); // 发射器
  html: any; // editormd编辑器

  constructor(@Attribute('id') private id: string) {
  }

  ngAfterViewInit(): void {
    console.log(editormd);
    this.html = editormd.markdownToHTML(this.id, this.config); // 解析 Markdown 2 Html
    console.log(this.config, this.html);

    // editormd.markdownToHTML('md2', this.config);
    // const out = this.onEditorChange;
    // const textarea = $('#' + this.id + ' :first'); // 获取textarea元素

    // 当编辑器内容改变时，触发textarea的change事件
    // this.html.on('once', function () {
    //   out.emit(textarea.val());
    // });
  }
}
