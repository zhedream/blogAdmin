export interface ArticleType {
    id: string
    title: string
    desc: string
    md: string // MD 文
    html: string // MD 
    catalogue: string // 目录
    tags: string
    isPublished: boolean
    createdAt: string
    updatedAt: string
}