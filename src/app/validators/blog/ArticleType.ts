import { TagType, TagConnectType } from './Tag';

export interface ArticleType {
    id: string
    title: string
    desc: string
    md: string // MD 文
    html: string // MD 
    catalogue: string // 目录
    tags: TagType[] | TagConnectType | string[]
    isPublished: boolean
    createdAt: string
    updatedAt: string
}

export interface ArticleConnectType {
    connect: {
        id: string
    }
}