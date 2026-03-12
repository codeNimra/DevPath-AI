/**
 * useClaude.js
 * ─────────────────────────────────────────────────────────────
 * Custom hook that wraps Claude API calls with loading, error,
 * and result state. Every page uses this hook instead of
 * calling the API directly, keeping components clean.
 *
 * Exports:
 *   ask(prompt, system?)  — single-turn call
 *   chat(messages, system?) — multi-turn call
 *   loading, error, result  — reactive state
 *   reset()               — clear all state
 *   cancel()              — abort in-flight request
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef } from 'react';
import { useApp }                        from '../context/AppContext';
import { askClaude, callClaude }         from '../utils/claudeApi';

export function useClaude() {
  const { apiKey, incrementStat } = useApp();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [result,  setResult]  = useState('');

  // cancelled flag — prevents stale setState after unmount / cancel
  const cancelled = useRef(false);

  const reset = useCallback(() => {
    cancelled.current = false;
    setLoading(false);
    setError(null);
    setResult('');
  }, []);

  const cancel = useCallback(() => {
    cancelled.current = true;
    setLoading(false);
  }, []);

  /** Single-turn ask */
  const ask = useCallback(async (prompt, system = '') => {
    if (!prompt?.trim()) return;
    cancelled.current = false;
    setLoading(true);
    setError(null);
    setResult('');

    try {
      const text = await askClaude(apiKey, prompt, system);
      if (cancelled.current) return;
      setResult(text);
      incrementStat('aiSessions');
      return text;
    } catch (err) {
      if (!cancelled.current) setError(err.message);
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, [apiKey, incrementStat]);

  /** Multi-turn chat */
  const chat = useCallback(async (messages, system = '') => {
    cancelled.current = false;
    setLoading(true);
    setError(null);

    try {
      const text = await callClaude(apiKey, messages, system);
      if (cancelled.current) return;
      setResult(text);
      incrementStat('aiSessions');
      return text;
    } catch (err) {
      if (!cancelled.current) setError(err.message);
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, [apiKey, incrementStat]);

  return { ask, chat, loading, error, result, reset, cancel };
}