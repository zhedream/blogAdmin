import { ArticleType, ArticleConnectType } from './ArticleType';

export interface TagType {
    id?: string
    name?: string
    articles?: ArticleType[] | ArticleConnectType
    createdAt?: string
    updatedAt?: string

}
export interface TagConnectType {
    connect: { id?: string, name?: string } | { id?: string, name?: string }[]

}
export interface TagSetType {
    set: {
        id?: string
        name?: string
    }
}
export interface TagCreateType {
    create: {
        id?: string
        name?: string
    }
}