import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CategoryType } from 'src/app/validators';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { Subscription } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.less']
})
export class CategoryComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  // 搜索参数
  data: CategoryType[] = [];
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
          click: (item: CategoryType) => {
            this.msg.success(`修改${item.id} 正在跳转...`)
            console.log(item);
            this.category.id = item.id
            this.category.name = item.name
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
  category: CategoryType = {};

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private categoryService: CategoryService

  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    // 处理\查询参数
    // 获取数据
    this.categoryService.get((categories: CategoryType[], getSub: Subscription) => {
      console.log('category GET', categories);
      if (!this.getSub) {
        this.getSub = getSub;
      }
      this.loading = false
      this.data = categories
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
    this.categoryService.reGet((res: CategoryType[]) => {
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
      nzTitle: '添加分类',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.categoryService.add((data) => {
          this.loading = false;
          this.msg.success(`添加成功`);
          this.categoryService.reGet(({ categories }: { categories: CategoryType[] }) => {
            this.data = categories;
            this.msg.success(`刷新缓存`);
            this.cdr.detectChanges();
          })
        }, this.category)
      },
    });
  }

  edit(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '修改分类',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.categoryService.edit((data) => {
          this.loading = false;
          if (data.id) {
            this.msg.success(`修改成功`);
          } else {
            this.msg.warning(`修改失败`);
          }
        }, this.category)
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