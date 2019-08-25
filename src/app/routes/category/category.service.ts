import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { CategoryType as tadaType } from 'src/app/validators';
import * as fragment from 'src/app/graphql/fragment'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // 获取
  getGql = gql`query get($where: CategoryWhereInput){
    categories(where:$where){ ...typeFra }
  }  ${fragment.typeFra} `;
  // 新增
  addGql = gql`
  mutation add($data: CategoryCreateInput!){
  createCategory(data:$data){ ...typeFra}
} ${fragment.typeFra} `;
  // 编辑
  editGql = gql`
mutation edit($where: CategoryWhereUniqueInput!,$data: CategoryUpdateInput!){
  updateCategory(where:$where,data:$data){ ...typeFra }
} ${fragment.typeFra} `;


  categories: tadaType[];

  constructor(
    private apollo: Apollo
  ) { }

  // 获取数据
  get(call, where) {
    const sub = this.apollo
      .watchQuery<any>({
        query: this.getGql
        , variables: { where }
      })
      .valueChanges.subscribe(({ data }) => {
        this.categories = data.categories as tadaType[];
        call(this.categories, sub)
      });

  }
  /**
   *   刷新本地缓存
   * @param callback 回调
   * @param where  参数
   */
  reGet(callback, where = {}) {
    this.apollo.query<tadaType[]>({
      query: this.getGql,
      variables: { where },
      fetchPolicy: 'no-cache'
    }).subscribe(({ data }) => {
      this.apollo.getClient().writeQuery({
        query: this.getGql,
        variables: where,
        data,
      })
      callback(data)
    })
  }
  /**
   * 新增
   * @param call  回调
   * @param category 数据
   */
  add(call, category: tadaType) {
    delete category.id;
    delete category.createdAt;
    delete category.updatedAt;
    this.apollo.mutate<{ createCategory: tadaType }>({ mutation: this.addGql, variables: { data: category } }).subscribe(({ data }) => { call(data.createCategory) }, error => {
      call(error)
    });

  }

  // 编辑文章
  edit(call, dat: tadaType) {
    const id = dat.id;
    delete dat.id;
    delete dat.createdAt;
    delete dat.updatedAt;
    this.apollo.mutate<{ updateCategory: tadaType }>({ mutation: this.editGql, variables: { where: { id }, data: dat } }).subscribe(({ data }) => { call(data.updateCategory) }, error => {
      call(error)
    });
  }

  // 删除文章 (逻辑删除)
  del() {
  }

  // 真删除
  rm() {
  }
}
