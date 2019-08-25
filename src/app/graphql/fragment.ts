export const articleFra = `
fragment articleFra on Article {
  id
  title
  desc
  md
  html
  catalogue
  clickCount
  readCount
  commentCount
  isPublished
  createdAt
  updatedAt
}`

export const tagFra = `
fragment tagFra on Tag {
	id
  name
  createdAt
  updatedAt
}`

export const typeFra = `
fragment typeFra on Category {
	id
  name
  createdAt
  updatedAt
}
`
