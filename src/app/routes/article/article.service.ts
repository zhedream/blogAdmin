import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ArticleType } from 'src/app/validators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  getGql = gql`query get($where: ArticleWhereInput){
    articles(where:$where){ id,title,desc,md,html,catalogue,tags{id,name},isPublished,createdAt,updatedAt}
  }`;

  addGql = gql`
  mutation add($data: ArticleCreateInput!){
  createArticle(data:$data){ id,title,desc,md,html,catalogue,tags{id,name},isPublished,createdAt,updatedAt}
}`;

  editGql = gql`
mutation edit($where: ArticleWhereUniqueInput!,$data: ArticleUpdateInput!){
  updateArticle(where:$where,data:$data){ id,title,desc,md,html,catalogue,tags{id,name},isPublished,createdAt,updatedAt}
}`;
  articles: ArticleType[];

  constructor(
    private apollo: Apollo
  ) { }

  get(call, where) {
    this.apollo
      .watchQuery<any>({
        query: this.getGql
        , variables: where
      })
      .valueChanges.subscribe(({ data }) => {
        this.articles = data.articles as ArticleType[];
        call(this.articles)
      });

  }
  reGet(callback, vbs = null) {
    this.apollo.query({
      query: this.getGql,
      variables: { ...vbs },
      fetchPolicy: 'no-cache'
    }).subscribe(data => {
      this.apollo.getClient().writeQuery({
        query: this.getGql,
        variables: vbs,
        data: data.data
      })
      callback(data)
    })
  }

  add(call, article: ArticleType) {
    delete article.id;
    delete article.createdAt;
    delete article.updatedAt;
    this.apollo.mutate<{ createArticle: ArticleType }>({ mutation: this.addGql, variables: { data: article } }).subscribe(({ data }) => { call(data.createArticle) }, error => {
      call(error)
    });

  }

  edit() {

  }

  del() {

  }

  /**
   * 获取服务器数据更新apollo缓存
   * @param gq gq查询语句
   * @param vbs 查询条件,变量
   * @param callback 更新缓存后的回调
   */
  updateChache(gq, vbs = null, callback) {
    this.apollo.query({
      query: gq,
      variables: { ...vbs },
      fetchPolicy: 'no-cache'
    }).subscribe(data => {
      this.apollo.getClient().writeQuery({
        query: gq,
        variables: vbs,
        data: data.data
      })
      callback(data)
    })
  }
}
