import { useState } from "react";
import MonitoringHeader from "@/features/monitoring/components/MonitoringHeader";
import CameraGrid from "@/features/monitoring/components/CameraGrid";
import AnalyticsPanel from "@/features/monitoring/components/AnalyticsPanel";
import EventLogPanel from "@/features/monitoring/components/EventLogPanel";
import {
  MOCK_CAMERAS,
  MOCK_EVENTS,
  MOCK_ANALYTICS_DATA,
  MOCK_ANALYTICS_STATS,
} from "@/features/monitoring/data/monitoring.mock";
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

export default function MonitoringPage() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("monitor");
  const criticalCount = MOCK_EVENTS.filter(
    (e) => e.severity === "critical",
  ).length;

  return (
    <>
      <MonitoringHeader />

      {/* ── 모바일/태블릿: 탭 전환 ──────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        {/* 세그먼트 탭 바 */}
        <div className="bg-monitor-bg shrink-0 px-3 pt-3 pb-2">
          <div className="flex gap-1 rounded-xl bg-[rgba(255,255,255,0.06)] p-1">
            {MOBILE_TABS.map(({ key, label, Icon }) => {
              const active = mobileTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMobileTab(key)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold tracking-[0.3px] transition-all",
                    active
                      ? "bg-monitor-card-bg text-monitor-accent-blue shadow-sm"
                      : "text-monitor-text-dim hover:text-monitor-text-muted",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
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

        {/* 탭 콘텐츠 */}
        <div className="bg-monitor-bg flex flex-1 flex-col overflow-hidden">
          {mobileTab === "monitor" && (
            <div className="flex flex-1 flex-col overflow-auto">
              {/* CCTV */}
              <div className="min-h-[220px] shrink-0 sm:min-h-[280px]">
                <CameraGrid cameras={MOCK_CAMERAS} />
              </div>
              {/* 분석 통계 */}
              <AnalyticsPanel
                stats={MOCK_ANALYTICS_STATS}
                chartData={MOCK_ANALYTICS_DATA}
                standalone
              />
            </div>
          )}

          {mobileTab === "events" && (
            <EventLogPanel events={MOCK_EVENTS} standalone />
          )}
        </div>
      </div>

      {/* ── 데스크톱: 기존 레이아웃 ─────────────── */}
      <main className="bg-monitor-bg hidden flex-1 overflow-hidden lg:flex">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CameraGrid cameras={MOCK_CAMERAS} />
          </div>
          <AnalyticsPanel
            stats={MOCK_ANALYTICS_STATS}
            chartData={MOCK_ANALYTICS_DATA}
          />
        </div>
        <EventLogPanel events={MOCK_EVENTS} />
      </main>
    </>
  );
}
