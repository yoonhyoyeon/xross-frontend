import type { DetectionEvent } from "@/features/monitoring/types/monitoring.types";
import EventCard from "@/features/monitoring/components/EventCard";
import LogsIcon from "@/assets/icons/logs.svg?react";
import { cn } from "@/shared/lib/utils";

interface EventLogPanelProps {
  events: DetectionEvent[];
  /** 모바일 탭에서 독립 뷰로 표시될 때 true — 보더/고정폭 제거 */
  standalone?: boolean;
}

export default function EventLogPanel({
  events,
  standalone,
}: EventLogPanelProps) {
  const criticalCount = events.filter((e) => e.severity === "critical").length;

  return (
    <div
      className={cn(
        "bg-monitor-bg flex flex-col",
        standalone
          ? "flex-1 overflow-hidden"
          : "border-monitor-border w-full shrink-0 border-t lg:h-full lg:w-[360px] lg:border-l lg:border-t-0",
      )}
    >
      {/* 헤더 — standalone 모바일 탭에서는 탭 바가 역할을 대신하므로 숨김 */}
      {!standalone && (
        <div className="border-monitor-border bg-monitor-card-bg flex h-[54px] shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <LogsIcon
              className="text-monitor-text-muted h-4 w-4 shrink-0"
              aria-hidden
            />
            <span className="text-monitor-text text-[14px] leading-5 font-bold tracking-[0.5px]">
              실시간 탐지 로그
            </span>
          </div>
          {criticalCount > 0 && (
            <span className="text-event-critical rounded-[4px] border border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.1)] px-2 py-[3px] text-[10px] leading-[15px] font-bold tracking-[0.12px]">
              {criticalCount}건 검토 필요
            </span>
          )}
        </div>
      )}

      {/* 이벤트 목록 */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
