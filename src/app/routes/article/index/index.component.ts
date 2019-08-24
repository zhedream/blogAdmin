import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EditorConfig } from 'src/app/editor/editor-config';
import { EditorChangeType, ArticleType } from 'src/app/validators';
import { ArticleService } from '../article.service';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],

})
export class IndexComponent implements OnInit {
  // 搜索参数
  q: any = {
    pi: 1,
    ps: 10,
    sorter: '',
    status: null,
    statusList: [],
  };
  data: ArticleType[] = [];
  loading = false;
  status = [
    { index: 1, text: '公开', value: true, type: 'success', checked: false },
    { index: 2, text: '私有', value: false, type: 'error', checked: false },
  ];
  statusMap = {
    true: { index: 1, text: '公开', value: true, type: 'success', checked: false },
    false: { index: 2, text: '私有', value: false, type: 'error', checked: false },
  };
  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '标题', index: 'title' },
    { title: '描述', index: 'desc' },
    {
      title: '点击次数',
      index: 'clickCount',
      type: 'number',
      format: (item: ArticleType) => `${item.clickCount} 次`,
      sorter: (a: ArticleType, b: ArticleType) => a.clickCount - b.clickCount,
    },
    {
      title: '状态',
      index: 'isPublished',
      render: 'stateTemp', // 自定义渲染模板
      filter: {
        menus: this.status,
        fn: (filter: any, record: ArticleType) => {
          return filter.value === record.isPublished;
        },
      },
    },
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
          text: '查看',
          click: (item: any) => this.msg.success(`查看${item.id}`),
        },
        {
          text: '修改',
          click: (item: any) => this.msg.success(`修改${item.id}`),
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalclick = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private articleService: ArticleService,

  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    // 处理\查询参数
    this.q.statusList = this.status.filter(w => w.checked).map(item => item.value);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }
    // 获取数据
    this.articleService.get((articles: ArticleType[]) => {
      this.loading = false
      this.data = articles
      this.cdr.detectChanges();
    }, {})
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalclick = this.selectedRows.reduce((total, cv: ArticleType) => total + cv.clickCount, 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  // 公开文章
  remove() {
    this.msg.success(' ( 设置公开 ) 正在刷新');
    this.articleService.reGet(() => {
      // this.getData();
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
      nzTitle: '发表文章',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.router.navigateByUrl("article/add");
      },
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
