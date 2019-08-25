import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef, OnDestroy } from '@angular/core';
import { TagType } from 'src/app/validators';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Subscription } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { ArticleService } from '../article/article.service';
import { TagService } from './tag.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.less']
})
export class TagComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  // 搜索参数
  data: TagType[] = [];
  loading = false;

  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '名称', index: 'name' },
    {
      title: '创建时间',
      index: 'createdAt',
      type: 'date',
      sort: {
        compare: (a: any, b: any) => a.createdAt - b.createdAt,
      },
    },
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          click: (item: TagType) => {
            this.msg.success(`修改${item.id} 正在跳转...`)
            console.log(item);
            this.tag.id = item.id
            this.edit(this.modalContent);
          },
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  tagName = '';
  totalclick = 0;
  expandForm = false;
  getSub: Subscription;
  tag: TagType = {};

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private tagService: TagService

  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    // 处理\查询参数
    // 获取数据
    this.tagService.get((tags: TagType[], getSub: Subscription) => {
      console.log('tag GET', tags);
      if (!this.getSub) {
        this.getSub = getSub;
      }
      this.loading = false
      this.data = tags
      this.cdr.detectChanges();
    }, {})
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.cdr.detectChanges();
        break;
    }
  }

  // 公开文章
  remove() {
    this.msg.success(' ( 设置公开 ) 正在刷新');
    this.tagService.reGet((res: TagType[]) => {
      this.data = res
      this.st.clearCheck();
    })
  }
  // 私有文章
  approval() {
    this.msg.success(`私有化 ${this.selectedRows.length} 篇文章`);
  }


  // 跳转到 add
  add(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '添加标签',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.msg.success('新增标签')
        this.tagService.add((data) => {
          this.loading = false;
          this.msg.success(`添加成功`);
          this.tagService.reGet(({ tags }: { tags: TagType[] }) => {
            this.data = tags;
            this.msg.success(`刷新缓存`);
            this.cdr.detectChanges();
          })
        }, this.tag)
      },
    });
  }

  edit(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '修改标签',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.tagService.edit((data) => {
          this.loading = false;
          if (data.id) {
            this.msg.success(`修改成功`);
          } else {
            this.msg.warning(`修改失败`);
          }
        }, this.tag)
      },
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }

  // 页面销毁前 取消订阅 
  ngOnDestroy() {
    // this.cdr.detach(); // try this
    // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
    this.getSub.unsubscribe();
  }
}
