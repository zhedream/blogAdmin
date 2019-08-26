import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ArticleType } from 'src/app/validators';
import * as fragment from 'src/app/graphql/fragment'


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  getGql = gql`query get($where: ArticleWhereInput){
    articles(where:$where){ ...articleFra , tags{ ...tagFra } ,type{ ...typeFra } }
  } ${fragment.articleFra} ${fragment.tagFra} ${fragment.typeFra}`;

  addGql = gql`
  mutation add($data: ArticleCreateInput!){
  createArticle(data:$data){ ...articleFra , tags{ ...tagFra } ,type{ ...typeFra } }
} ${fragment.articleFra} ${fragment.tagFra} ${fragment.typeFra}`;

  editGql = gql`
mutation edit($where: ArticleWhereUniqueInput!,$data: ArticleUpdateInput!){
  updateArticle(where:$where,data:$data){ ...articleFra , tags{ ...tagFra } ,type{ ...typeFra } }
} ${fragment.articleFra} ${fragment.tagFra} ${fragment.typeFra}`;

  articles: ArticleType[];

  constructor(
    private apollo: Apollo
  ) { }

  // 获取文章
  get(call, where) {
    const sub = this.apollo
      .watchQuery<any>({
        query: this.getGql
        , variables: { where }
      })
      .valueChanges.subscribe(({ data }) => {
        this.articles = data.articles as ArticleType[];
        call(this.articles, sub)
      });

  }
  /**
   *   刷新缓存-文章
   * @param callback 回调
   * @param where  条件
   */
  reGet(callback, where = {}) {
    this.apollo.query({
      query: this.getGql,
      variables: { where },
      fetchPolicy: 'no-cache'
    }).subscribe(({ data }) => {
      this.apollo.getClient().writeQuery({
        query: this.getGql,
        variables: { where },
        data
      })
      callback(data)
    })
  }
  /**
   * 新增文章
   * @param call  回调
   * @param article 文章数据
   */
  add(call, article: ArticleType) {
    delete article.id;
    delete article.createdAt;
    delete article.updatedAt;
    this.apollo.mutate<{ createArticle: ArticleType }>({ mutation: this.addGql, variables: { data: article } }).subscribe(({ data }) => { call(data.createArticle) }, error => {
      call(error)
    });

  }

  // 编辑文章
  edit(call, article: ArticleType) {
    const id = article.id;
    delete article.id;
    delete article.createdAt;
    delete article.updatedAt;
    this.apollo.mutate<{ updateArticle: ArticleType }>({ mutation: this.editGql, variables: { where: { id }, data: article } }).subscribe(({ data }) => { call(data.updateArticle) }, error => {
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
