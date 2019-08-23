import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { EditorConfig } from 'src/app/editor/editor-config';
import { EditorChangeType } from 'src/app/editor/EditorChangeType';
import { ArticleType } from 'src/app/validators/index';

@Component({
  selector: 'app-apollo',
  templateUrl: './apollo.component.html',
  styleUrls: ['./apollo.component.less']
})
export class ApolloComponent implements OnInit {
  articles: [ArticleType];
  article: ArticleType;
  md: any;
  html: any;

  constructor(private apollo: Apollo) { }
  conf = new EditorConfig();
  ngOnInit() {

    const gq = gql`{
      articles{
        id
        title
        md
        html
      }
    }`;
    const vb = [];

    this.apollo
      .watchQuery({
        query: gq
        , variables: vb
      })
      .valueChanges.subscribe(result => {
        // tslint:disable-next-line:no-string-literal
        this.articles = result.data['article'] as [ArticleType];
        this.article = this.articles[0];
        this.md = '';
        this.html = this.article.html;
        console.log(this.article);
      });

  }
  change(data: EditorChangeType) {
    // console.log(data);
    // this.html = data.html;
  }

}
