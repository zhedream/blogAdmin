import { TagType, TagConnectType } from './TagType';
import { CategoryType, CategoryConnectType } from './CategoryType';

export interface ArticleType {
    id: string
    title: string // 文章标题
    desc: string // 描述
    md: string // MD 文
    html: string // MD 
    catalogue: string // 目录
    clickCount: number // 点击次数
    readCount: number // 阅读次数
    commentCount: number // 评论次数
    tags: TagType[] | TagConnectType | string[] // 文章标签
    type: CategoryType | CategoryConnectType // 文章类型
    isPublished: boolean // 是否公开
    createdAt: string
    updatedAt: string
}

export interface ArticleConnectType {
    connect: {
        id: string
    }
}