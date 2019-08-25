import { ArticleType, ArticleConnectType } from './ArticleType';

export interface CategoryType {
    id?: string
    name?: string
    articles?: ArticleType | ArticleConnectType
    createdAt?: string
    updatedAt?: string
}
// 关联时类型
export interface CategoryConnectType {
    connect: { id?: string, name?: string }
}