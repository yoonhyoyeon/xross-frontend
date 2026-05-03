import { useState } from "react";
import MonitoringHeader from "@/features/monitoring/components/MonitoringHeader";
import CameraGrid from "@/features/monitoring/components/CameraGrid";
import AnalyticsPanel from "@/features/monitoring/components/AnalyticsPanel";
import EventLogPanel from "@/features/monitoring/components/EventLogPanel";
import { MOCK_CAMERAS } from "@/features/monitoring/data/monitoring.mock";
import { useEventStream } from "@/features/monitoring/hooks/useEventStream";
import { useAlertStream } from "@/features/monitoring/hooks/useAlertStream";
import type { EventResponse } from "@/features/monitoring/api/monitoring.types";
import type { AnalyticsDataPoint } from "@/features/monitoring/types/monitoring.types";
import { cn } from "@/shared/lib/utils";
import ShieldIcon from "@/assets/icons/shield.svg?react";
import LogsIcon from "@/assets/icons/logs.svg?react";

type MobileTab = "monitor" | "events";

const MOBILE_TABS: {
  key: MobileTab;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { key: "monitor", label: "관제", Icon: ShieldIcon },
  { key: "events", label: "탐지 로그", Icon: LogsIcon },
];

function buildStats(events: EventResponse[]) {
  return [
    {
      label: "총 입장",
      value: String(events.filter((e) => e.type === "ENTER").length),
    },
    {
      label: "상품 집기",
      value: String(events.filter((e) => e.type === "PICK").length),
    },
    {
      label: "이상 감지",
      value: String(events.filter((e) => e.type === "ALERT").length),
      variant: "danger" as const,
    },
    {
      label: "결제 완료",
      value: String(events.filter((e) => e.type === "PAYMENT").length),
      variant: "success" as const,
    },
  ];
}

function buildChartData(events: EventResponse[]): AnalyticsDataPoint[] {
  const now = new Date();
  const currentHour = now.getHours();

  return Array.from({ length: currentHour + 1 }, (_, h) => {
    const hour = new Date(now);
    hour.setHours(h, 0, 0, 0);
    const nextHour = new Date(hour);
    nextHour.setHours(h + 1);

    const inRange = events.filter((e) => {
      const t = new Date(e.occurredAt).getTime();
      return t >= hour.getTime() && t < nextHour.getTime();
    });

    return {
      time: `${h}시`,
      picks: inRange.filter((e) => e.type === "PICK").length,
      suspicions: inRange.filter(
        (e) => e.type === "ALERT" || e.type === "WEIGHT_CHANGE",
      ).length,
    };
  });
}

export default function MonitoringPage() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("monitor");
  const { events } = useEventStream();
  const { alerts, connected } = useAlertStream();

  const criticalCount = alerts.filter(
    (a) => a.status === "PENDING" || a.status === "SENT",
  ).length;
  const stats = buildStats(events);
  const chartData = buildChartData(events);

  return (
    <>
      <MonitoringHeader />

      {/* ── 모바일/태블릿: 탭 전환 ──────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        <div className="border-monitor-border bg-monitor-bg shrink-0 border-b px-3 py-2.5">
          <div className="flex gap-1 rounded-xl bg-[rgba(255,255,255,0.06)] p-1">
            {MOBILE_TABS.map(({ key, label, Icon }) => {
              const active = mobileTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMobileTab(key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold tracking-[0.2px] transition-all",
                    active
                      ? "bg-monitor-card-bg text-monitor-accent-blue"
                      : "text-monitor-text-dim hover:text-monitor-text-muted",
                  )}
                >
                  <span
                    className="relative size-3.5 shrink-0"
                    style={
                      {
                        color: active ? "#51a2ff" : "#62748e",
                      } as React.CSSProperties
                    }
                  >
                    <Icon className="absolute block size-full max-w-none" />
                  </span>
                  {label}
                  {key === "events" && criticalCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-event-critical px-1 text-[8px] font-bold leading-none text-white">
                      {criticalCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-monitor-bg flex flex-1 flex-col overflow-hidden">
          {mobileTab === "monitor" && (
            <div className="flex flex-1 flex-col overflow-auto">
              <div className="min-h-[220px] shrink-0 sm:min-h-[280px]">
                <CameraGrid cameras={MOCK_CAMERAS} />
              </div>
              <AnalyticsPanel stats={stats} chartData={chartData} standalone />
            </div>
          )}

          {mobileTab === "events" && (
            <EventLogPanel alerts={alerts} connected={connected} standalone />
          )}
        </div>
      </div>

      {/* ── 데스크톱: 기존 레이아웃 ─────────────── */}
      <main className="bg-monitor-bg hidden flex-1 overflow-hidden lg:flex">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CameraGrid cameras={MOCK_CAMERAS} />
          </div>
          <AnalyticsPanel stats={stats} chartData={chartData} />
        </div>
        <EventLogPanel alerts={alerts} connected={connected} />
      </main>
    </>
  );
}
