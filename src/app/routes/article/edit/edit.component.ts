import { Component, OnInit, ChangeDetectorRef, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditorConfig } from 'src/app/editor/editor-config';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ArticleService } from '../article.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EditorChangeType, ArticleType, TagType, CategoryType } from 'src/app/validators';
import { Subscription } from 'rxjs';
import { TagService } from '../../tag/tag.service';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit, OnDestroy {

  form: FormGroup; // 表单
  submitting = false;
  conf = new EditorConfig(); // markdown 配置
  listOfOption: Array<{ label: string; value: string }> = []; // 标签
  typeListOfOption: Array<{ label: string; value: string }> = []; // 分类
  tagName: any; // 新增的 标签名 | 分类名
  id: string; // 文章ID
  article: ArticleType; // 编辑的文章
  md: string; // 文章的原始MD, 用于编辑
  getSub: Subscription; // 数据订阅
  tagsID: string[] = []; // 文章的 标签ID
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modalSrv: NzModalService,
    private articleService: ArticleService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id; // 文章ID
      this.getData();
    })

    this.form = this.fb.group({
      id: [null, []], // id
      title: [null, [Validators.required]], // 标题
      desc: [null, []], // 描述
      md: [null, [Validators.required]], // md
      html: [null, []], // html
      tags: [null, []], // 标签
      type: [null, []], // 分类
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
      const type = this.article.type as CategoryType; // 多个接口的 需要断言
      const tags = this.article.tags as TagType[];
      this.tagsID = tags.map(item => item.id, []); // 处理标签 ID
      this.form.patchValue(this.article); // 赋值
      this.form.patchValue({ tags: this.tagsID });
      this.form.patchValue({ type: type ? type.id : null }); // 无文章ID
      this.md = this.article.md;
    }, { id: this.id })
    // 获取标签
    this.tagService.get((tags: TagType[]) => {
      this.listOfOption = tags.map(item => {
        return { label: item.name, value: item.id }
      }, [])
      console.log(tags);
    }, {})
    // 获取 分类
    this.categoryService.get((categories: TagType[]) => {
      this.typeListOfOption = categories.map(item => {
        return { label: item.name, value: item.id }
      }, [])
      console.log(categories);
    }, {})
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
        const tagName = this.tagName;
        this.tagService.add((tag: TagType) => {
          this.tagService.reGet(({ tags }: { tags: TagType[] }) => {
            this.msg.success('添加成功');
            this.listOfOption = tags.map(item => {
              return { label: item.name, value: item.id }
            }, [])
          }, {})
        }, { name: tagName })
      },
    });
  }

  // 新增一个 文章分类
  addType(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '新建分类',
      nzContent: tpl,
      nzOnOk: () => {
        const typeName = this.tagName; // 文章分类
        this.categoryService.add((tag: CategoryType) => {
          this.categoryService.reGet(({ categories }: { categories: CategoryType[] }) => {
            this.msg.success('添加成功');
            this.typeListOfOption = categories.map(item => {
              return { label: item.name, value: item.id }
            }, [])
          }, {})
        }, { name: typeName })
      },
    });
  }

  // 提交
  submit() {
    this.submitting = true;
    let article: ArticleType;
    article = this.form.value;
    const tagsTemp = article.tags ? article.tags : [] as any; // 这里的 tag 应该是  string[]    标签的 id
    const typeID = article.type ? article.type : null as any; // 这里的  type 应该是  string  大分类的  id
    article.tags = {
      set: tagsTemp.map((id) => {
        if (id.id) id = id.id; // string | tagType;
        return { id };
      }, [])
    };
    article.type = {
      connect: typeID ? { id: typeID } : null
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
