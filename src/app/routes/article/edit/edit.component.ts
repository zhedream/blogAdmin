import { Component, OnInit, ChangeDetectorRef, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditorConfig } from 'src/app/editor/editor-config';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ArticleService } from '../article.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EditorChangeType, ArticleType } from 'src/app/validators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  submitting = false;
  conf = new EditorConfig();
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  tagName: any;
  id: any;
  article: ArticleType;
  md: string;
  getSub: Subscription;
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modalSrv: NzModalService,
    private articleService: ArticleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id; // 文章ID
      this.getData();
    })

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
  // 标签事件
  optionChange(data) {

  }
  // 获取数据
  getData() {
    this.articleService.get((data: ArticleType[], getSub: Subscription) => {
      if (!this.getSub) {
        this.getSub = getSub;
      }
      this.article = data[0];
      if (!this.article) {
        this.msg.error('编辑失败，没有这篇文章')
        this.router.navigateByUrl('article/index');
        return;
      }
      console.log(this.article);
      this.form.patchValue(this.article);
      this.md = this.article.md;
    }, { id: this.id })
  }
  // 获取 editor 内容
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
    const tags = article.tags ? article.tags : [] as any; // 这里的 tag 应该是  string[]    标签的 id
    const type = article.type ? article.type : null as any; // 这里的  type 应该是  string  大分类的  id
    article.tags = {
      connect: tags.map((id) => {
        return { id };
      }, [])
    };
    article.type = {
      connect: type ? { id: type } : null
    };
    this.articleService.edit((data: ArticleType) => {
      if (data.id) {
        this.articleService.reGet(res => {
          this.msg.success(`修改成功`);
          this.router.navigateByUrl("article/index")
        })
      } else {
        this.msg.warning(`修改失败`);
      }
      this.submitting = false;
      this.cdr.detectChanges();
    }, article)
  }

  ngOnDestroy() {
    // this.cdr.detach(); // try this   // 好像没有什么用
    // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
    this.getSub.unsubscribe();
  }
}
