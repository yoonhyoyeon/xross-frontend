import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { BASE_URL } from "@/shared/lib/api";
import { getAlerts } from "@/features/monitoring/api/monitoring.api";
import type { AlertResponse } from "@/features/monitoring/api/monitoring.types";

const POLL_INTERVAL = 5_000;

export function useAlertStream(limit?: number | null) {
  const storeId = useAuthStore((s) => s.storeId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [connected, setConnected] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!storeId || !Number.isInteger(storeId) || !accessToken) return;

    let mounted = true;
    let retryDelay = 1000;
    let currentAbort: AbortController | null = null;

    const startPolling = () => {
      if (!mounted) return;
      getAlerts(storeId)
        .then((data) => {
          if (!mounted) return;
          setAlerts(data);
          setConnected(true);
        })
        .catch(() => {
          if (mounted) setConnected(false);
        });

      pollRef.current = setInterval(() => {
        if (!mounted) return;
        getAlerts(storeId)
          .then((data) => {
            if (!mounted) return;
            setAlerts(data);
            setConnected(true);
          })
          .catch(() => {
            if (mounted) setConnected(false);
          });
      }, POLL_INTERVAL);
    };

    const connect = async () => {
      if (!mounted) return;

      currentAbort = new AbortController();
      setAlerts([]);

      try {
        setConnected(false);

        const response = await fetch(
          `${BASE_URL}/alerts/stream?storeId=${storeId}${limit != null ? `&limit=${limit}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "text/event-stream",
            },
            signal: currentAbort.signal,
          },
        );

        if (response.status >= 400 && response.status < 500) {
          startPolling();
          return;
        }

        if (!response.ok || !response.body) {
          throw new Error(`SSE 연결 실패: ${response.status}`);
        }

        setConnected(true);
        retryDelay = 1000;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (mounted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw) continue;
            try {
              const incoming = JSON.parse(raw) as AlertResponse;
              setAlerts((prev) => {
                const exists = prev.findIndex((a) => a.id === incoming.id);
                if (exists !== -1) {
                  const next = [...prev];
                  next[exists] = incoming;
                  return next;
                }
                return [incoming, ...prev];
              });
            } catch {
              // 파싱 실패는 무시
            }
          }
        }
      } catch (err) {
        if (!mounted || (err as Error).name === "AbortError") return;
        setConnected(false);
        setTimeout(() => {
          if (mounted) connect();
        }, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30_000);
      }
    };

    connect();

    return () => {
      mounted = false;
      currentAbort?.abort();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storeId, accessToken]);

  return { alerts, connected };
}
