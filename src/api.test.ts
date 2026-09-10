import { afterEach, describe, expect, it, vi } from 'vitest';
import { request, taxonomyMutation, validateEndpoint } from './api';

const session = { endpoint: 'https://api.example.com/graphql', token: 'secret', expiresAt: Date.now() + 60_000 };

afterEach(() => vi.unstubAllGlobals());

describe('admin API client', () => {
  it('only accepts secure remote endpoints and credential-free URLs', () => {
    vi.stubGlobal('window', { location: { origin: 'https://admin.example.com' } });
    expect(validateEndpoint('/api/graphql')).toBe('https://admin.example.com/api/graphql');
    expect(validateEndpoint('http://localhost:7200/graphql')).toBe('http://localhost:7200/graphql');
    expect(() => validateEndpoint('http://api.example.com/graphql')).toThrow('HTTPS');
    expect(() => validateEndpoint('https://user:pass@api.example.com/graphql')).toThrow('不能包含');
  });

  it('sends the token in the authorization header and returns typed data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { adminSession: true } }), {
      headers: { 'content-type': 'application/json' }
    }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(request<{ adminSession: boolean }>(session, '{ adminSession }')).resolves.toEqual({ adminSession: true });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers.Authorization).toBe('Bearer secret');
    expect(JSON.parse(init.body)).toEqual({ query: '{ adminSession }', variables: {} });
  });

  it('maps authentication failures to the login message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      errors: [{ message: 'denied', extensions: { code: 'UNAUTHENTICATED' } }]
    }), { status: 200 })));
    await expect(request(session, '{ adminSession }')).rejects.toEqual(expect.objectContaining({
      code: 'UNAUTHENTICATED', message: '管理密钥无效或已过期，请重新登录'
    }));
  });

  it('builds the expected taxonomy mutation names', () => {
    expect(taxonomyMutation('tags', 'create')).toContain('createTag');
    expect(taxonomyMutation('categories', 'delete')).toContain('deleteCategory');
  });
});
