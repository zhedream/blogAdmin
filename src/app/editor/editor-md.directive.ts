import { AfterViewInit, Attribute, Directive, EventEmitter, Input, Output } from '@angular/core';
import { EditorConfig } from './editor-config';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EditorChangeType } from './EditorChangeType';

declare var editormd: any;
declare var $: any;

@Directive({
  selector: '[appEditorMd]'
})
export class EditorMdDirective implements AfterViewInit {
  @Input() config: EditorConfig; // 配置选项
  @Input() md: string; // markdown
  @Output() OnEditorChange: EventEmitter<EditorChangeType> = new EventEmitter<EditorChangeType>(); // 发射器
  editor: any; // editormd编辑器

  constructor(@Attribute('id') private id: string) {
  }

  ngAfterViewInit(): void {
    if (this.md) this.config.markdown = this.md;
    this.editor = editormd(this.id, this.config); // 创建编辑器

    const out = this.OnEditorChange;
    // 当编辑器内容改变时，触发textarea的change事件
    fromEvent(this.editor, 'change').pipe(debounceTime(250))
      .subscribe(() => {
        const html = $(this.editor.preview[0]).html();
        console.log(this.editor.pr);
        const catalogue = $('.markdown-toc.editormd-markdown-toc').prop("outerHTML");
        let md = this.editor.markdownTextarea;
        md = $(md).html();
        out.emit({ md, catalogue, html });
      });
  }
}
