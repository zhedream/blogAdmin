export interface Taxonomy { id: string; name: string | null; createdAt?: string }
export interface Article {
  id: string; title: string; desc: string | null; md?: string | null; html?: string | null;
  catalogue?: string | null; isPublished: boolean; createdAt: string; updatedAt: string;
  clickCount: number; tags: Taxonomy[]; type: Taxonomy | null;
}
export interface ArticleInput { title: string; desc: string; md: string; html: string; catalogue: string; isPublished: boolean; typeId: string | null; tagIds: string[] }
export interface Session { endpoint: string; token: string; expiresAt: number }
const SESSION_KEY = 'blog-studio-session-v2';
export const defaultEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || '/api/graphql';
export function loadSession(): Session | null {
  try {
    const item = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (item && typeof item.token === 'string' && typeof item.endpoint === 'string' && item.expiresAt > Date.now()) return item;
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* Storage can be disabled. */ }
  return null;
}
export function saveSession(session: Session | null) {
  try { session ? sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)) : sessionStorage.removeItem(SESSION_KEY); } catch { /* Memory-only login still works. */ }
}
export function validateEndpoint(value: string): string {
  const url = new URL(value, window.location.origin);
  if (url.username || url.password || url.hash || url.search) throw new Error('服务地址不能包含账号、密码、查询参数或锚点');
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw new Error('请使用 HTTPS 地址；本地开发可使用 localhost');
  return url.href;
}
export class ApiError extends Error { constructor(message: string, public code?: string) { super(message); } }
export async function request<T>(session: Session, query: string, variables: Record<string, unknown> = {}, signal?: AbortSignal): Promise<T> {
  if (session.expiresAt <= Date.now()) throw new ApiError('登录已过期，请重新登录', 'UNAUTHENTICATED');
  let response: Response;
  try {
    response = await fetch(session.endpoint, { method: 'POST', redirect: 'error', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ query, variables }), signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000) });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError('连接失败或请求超时，请检查服务地址与网络');
  }
  let result;
  try { result = await response.json(); } catch { throw new ApiError('接口未返回 GraphQL 数据，请检查服务地址'); }
  if (!response.ok || result.errors?.length) {
    const code = result.errors?.[0]?.extensions?.code;
    throw new ApiError(code === 'UNAUTHENTICATED' ? '管理密钥无效或已过期，请重新登录' : result.errors?.[0]?.message || `请求失败（${response.status}）`, code);
  }
  if (!result.data) throw new ApiError('接口返回了空响应');
  return result.data as T;
}
export const articleFields = 'id title desc isPublished createdAt updatedAt clickCount tags { id name } type { id name }';
export const operations = {
  session: 'query AdminSession { adminSession }',
  articles: `query AdminArticles($where: ArticleWhereInput, $skip: Int, $first: Int) { articlesConnection(where: $where, orderBy: { updatedAt: desc }, skip: $skip, first: $first) { aggregate { count } nodes { ${articleFields} } } }`,
  article: `query AdminArticle($where: ArticleWhereUniqueInput!) { article(where: $where) { ${articleFields} md html catalogue } }`,
  taxonomy: 'query AdminTaxonomy { tags(orderBy: { createdAt: desc }) { id name createdAt } categories(orderBy: { createdAt: desc }) { id name createdAt } }',
  create: 'mutation CreateArticle($data: ArticleCreateInput!) { createArticle(data: $data) { id } }',
  update: 'mutation UpdateArticle($where: ArticleWhereUniqueInput!, $data: ArticleUpdateInput!) { updateArticle(where: $where, data: $data) { id } }',
  remove: 'mutation DeleteArticle($where: ArticleWhereUniqueInput!) { deleteArticle(where: $where) { id } }',
  publishMany: 'mutation PublishArticles($where: ArticleWhereInput!, $data: ArticleUpdateInput!) { updateManyArticles(where: $where, data: $data) { count } }',
  dashboard: `query AdminOverview { total: articlesConnection { aggregate { count } } published: articlesConnection(where: { isPublished: true }) { aggregate { count } } drafts: articlesConnection(where: { isPublished: false }) { aggregate { count } } recent: articles(first: 5, orderBy: { updatedAt: desc }) { ${articleFields} } tags { id } categories { id } }`,
};
export function taxonomyMutation(kind: 'tags' | 'categories', action: 'create' | 'update' | 'delete') {
  const type = kind === 'tags' ? 'Tag' : 'Category';
  const vars = action === 'create' ? `$data: ${type}CreateInput!` : action === 'update' ? `$where: ${type}WhereUniqueInput!, $data: ${type}UpdateInput!` : `$where: ${type}WhereUniqueInput!`;
  const args = action === 'create' ? 'data: $data' : action === 'update' ? 'where: $where, data: $data' : 'where: $where';
  return `mutation ${action}${type}(${vars}) { ${action}${type}(${args}) { id } }`;
}
