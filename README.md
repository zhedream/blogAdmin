# Blog Studio

博客内容管理后台，使用 React、TypeScript 和 Vite 构建，通过 GraphQL 管理文章、分类和标签。

## 本地运行

```bash
cp .env.example .env.local
npm ci
npm run dev
```

`VITE_GRAPHQL_ENDPOINT` 只保存公开的 GraphQL URL。管理密钥只在登录页面输入，并保存在当前浏览器标签页的 `sessionStorage` 中，8 小时后自动失效。不要把管理密钥放入任何 `VITE_*` 变量或提交到 Git。

配套的 `blogPrisma` 服务需要设置同一份 `ADMIN_API_TOKEN`，长度至少为 32 个字符：

```bash
openssl rand -hex 32
```

## 验证

```bash
npm run build
npm test
npm run security:audit
npx playwright install chromium
npm run test:e2e
```

## 部署

Vercel 构建设置已经写入 `vercel.json`。部署时只需配置 `VITE_GRAPHQL_ENDPOINT`，值为 Blog API 的完整 HTTPS GraphQL 地址，例如 `https://your-api.example/api/graphql`。

后台是静态单页应用，使用 Hash Router，因此直接刷新文章编辑页也能正常工作。
