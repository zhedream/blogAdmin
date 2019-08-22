import { Component, OnInit } from '@angular/core';
import { EditorConfig } from '../../../editor/editor-config';
declare var editormd: any;

@Component({
  selector: 'app-editormd',
  templateUrl: './editormd.component.html',
  styleUrls: ['./editormd.component.less']
})
export class EditormdComponent implements OnInit {
  conf = new EditorConfig();
  markdown = '测试语句';
  constructor() { }

  ngOnInit() {
  }
  // 同步属性内容
  syncModel(str): void {
    this.markdown = str;
  }
}
