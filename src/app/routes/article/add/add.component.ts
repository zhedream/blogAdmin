import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditorConfig } from 'src/app/editor/editor-config';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EditorChangeType, ArticleType } from 'src/app/validators';
import { ArticleService } from '../article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  form: FormGroup;
  submitting = false;
  conf = new EditorConfig();
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  tagName: any;
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modalSrv: NzModalService,
    private articleService: ArticleService,
    private router: Router

  ) { }

  ngOnInit(): void {

    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: 'label' + i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;

    this.form = this.fb.group({
      id: [null, []], // id
      title: [null, [Validators.required]], // 标题
      desc: [null, []], // 描述
      md: [null, [Validators.required]], // md
      html: [null, []], // html
      tags: [null, []], // tags
      catalogue: [null, []], // 目录
      isPublished: [true, []], // 是否公开
      createdAt: [null, []], // 创建时间
      updatedAt: [null, []], // 更新时间
    });
  }

  optionChange(data) {
    console.log(data);
    console.log(this.listOfOption);

  }
  // 获取editor 内容
  syncModel(data: EditorChangeType) {
    this.form.patchValue({
      md: data.md,
      html: data.html,
      catalogue: data.catalogue,
    });
  }
  // 新增一个标签
  addTag(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '新建标签',
      nzContent: tpl,
      nzOnOk: () => {
        console.log(this.tagName);
        this.msg.success('添加成功');
        // this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
      },
    });
  }
  // 提交
  submit() {
    this.submitting = true;
    let article: ArticleType;
    article = this.form.value;
    const tags = article.tags ? article.tags : [] as any;
    article.tags = {
      connect: tags.map((id) => {
        return { id };
      }, [])
    };
    console.log(article);
    this.articleService.add((data: ArticleType) => {
      console.log(data)
      if (data.id) {
        this.articleService.reGet(res => {
          this.msg.success(`提交成功`);
          this.router.navigateByUrl("article/index")
          console.log(res);

        })
      } else {
        this.msg.warning(`提交失败`);
      }
      this.submitting = false;
      this.cdr.detectChanges();

    }, article)
  }

}
