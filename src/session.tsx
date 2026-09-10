import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { ApiError, loadSession, request, saveSession, type Session } from './api';
interface SessionContext { session: Session | null; login: (s: Session) => void; logout: () => void; api: <T>(q: string, v?: Record<string, unknown>, signal?: AbortSignal) => Promise<T> }
const Context = createContext<SessionContext | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(loadSession);
  const login = useCallback((s: Session) => { saveSession(s); setSession(s); }, []);
  const logout = useCallback(() => { saveSession(null); setSession(null); }, []);
  useEffect(() => { if (!session) return; const timer = setTimeout(logout, Math.max(0, session.expiresAt - Date.now())); return () => clearTimeout(timer); }, [session, logout]);
  const api = useCallback(async <T,>(q: string, v?: Record<string, unknown>, signal?: AbortSignal): Promise<T> => {
    if (!session) throw new ApiError('请先登录');
    try { return await request<T>(session, q, v, signal); }
    catch (error) { if (error instanceof ApiError && error.code === 'UNAUTHENTICATED') logout(); throw error; }
  }, [session, logout]);
  return <Context.Provider value={{ session, login, logout, api }}>{children}</Context.Provider>;
}
export function useSession() { const value = useContext(Context); if (!value) throw new Error('Missing session provider'); return value; }
export function useQuery<T>(query: string, variables: Record<string, unknown> = {}) {
  const { api } = useSession();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const key = JSON.stringify(variables);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    api<T>(query, JSON.parse(key), controller.signal).then(setData).catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [api, query, key, version]);
  return { data, error, loading, reload: () => setVersion(v => v + 1) };
}
