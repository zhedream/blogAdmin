import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { TagType as dataType } from 'src/app/validators/blog/TagType';
import * as fragment from 'src/app/graphql/fragment'

@Injectable({
  providedIn: 'root'
})
export class TagService {

  // 获取
  getGql = gql`query get($where: TagWhereInput){
    tags(where:$where){ ...tagFra }
  } ${fragment.tagFra} `;
  // 新增
  addGql = gql`mutation add($data: TagCreateInput!){
  createTag(data:$data){ ...tagFra}
} ${fragment.tagFra} `;
  // 编辑
  editGql = gql`mutation edit($where: TagWhereUniqueInput!,$data: TagUpdateInput!){
  updateTag(where:$where,data:$data){ ...tagFra }
} ${fragment.tagFra} `;


  tags: dataType[];

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
        this.tags = data.tags as dataType[];
        call(this.tags, sub)
      });

  }
  /**
   *   刷新本地缓存
   * @param callback 回调
   * @param where  条件
   */
  reGet(callback, where = {}) {
    // const dataOld = this.apollo.getClient().readQuery({ query: this.getGql, variables: { where } });
    this.apollo.query<dataType[]>({
      query: this.getGql,
      variables: { where },
      fetchPolicy: 'no-cache'
    }).subscribe(({ data }) => {
      this.apollo.getClient().writeQuery({
        query: this.getGql,
        variables: { where },
        data,
      })
      callback(data)
    })
  }
  /**
   * 新增
   * @param call  回调
   * @param tag 数据
   */
  add(call, tag: dataType) {
    delete tag.id;
    delete tag.createdAt;
    delete tag.updatedAt;
    this.apollo.mutate<{ createTag: dataType }>({ mutation: this.addGql, variables: { data: tag } }).subscribe(({ data }) => { call(data.createTag) }, error => {
      call(error)
    });

  }

  // 编辑文章
  edit(call, dat: dataType) {
    const id = dat.id;
    delete dat.id;
    delete dat.createdAt;
    delete dat.updatedAt;
    this.apollo.mutate<{ updateTag: dataType }>({ mutation: this.editGql, variables: { where: { id }, data: dat } }).subscribe(({ data }) => { call(data.updateTag) }, error => {
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
