import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.example.com/graphql', async route => {
    const body = route.request().postDataJSON() as { query: string };
    let data: Record<string, unknown> = {};
    if (body.query.includes('AdminSession')) data = { adminSession: true };
    if (body.query.includes('AdminOverview')) data = {
      total: { aggregate: { count: 3 } }, published: { aggregate: { count: 2 } },
      drafts: { aggregate: { count: 1 } }, recent: [], tags: [{ id: 't1' }], categories: [{ id: 'c1' }]
    };
    await route.fulfill({ json: { data } });
  });
});

test('logs in and renders the content dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '回到你的创作空间' })).toBeVisible();
  await page.getByLabel('管理密钥').fill('local-test-key');
  await page.getByLabel('GraphQL 服务地址').fill('https://api.example.com/graphql');
  await page.getByRole('button', { name: /进入工作台/ }).click();
  await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();
  await expect(page.getByText('3', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /文章管理/ })).toBeVisible();
});
