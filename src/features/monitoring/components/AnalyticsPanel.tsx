import ChartAnalyticsIcon from "@/assets/icons/chart-analytics.svg?react";
import AnalyticsChart from "@/features/monitoring/components/AnalyticsChart";
import type { AnalyticsDataPoint } from "@/features/monitoring/types/monitoring.types";
import { cn } from "@/shared/lib/utils";

interface AnalyticsStat {
  label: string;
  value: string;
  variant?: "default" | "danger" | "success";
}

interface AnalyticsPanelProps {
  stats: AnalyticsStat[];
  chartData: AnalyticsDataPoint[];
}

const STAT_VALUE_COLOR = {
  default: "text-white",
  danger: "text-event-critical",
  success: "text-monitor-accent-green",
};

export default function AnalyticsPanel({
  stats,
  chartData,
}: AnalyticsPanelProps) {
  return (
    <div className="border-monitor-border bg-monitor-bg flex shrink-0 flex-col border-t px-4 pt-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="text-monitor-text-muted flex items-center gap-[6px]">
          <ChartAnalyticsIcon className="h-5 w-5 shrink-0" />
          <span className="text-[12px] leading-4 font-bold tracking-[1.2px] uppercase">
            매장 행동 분석 통계 (금일)
          </span>
        </div>

        {/* 통계 수치 */}
        <div className="flex items-start gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-end",
                i > 0 && "border-monitor-border-strong border-l pl-6",
              )}
            >
              <span className="text-monitor-text-dim font-mono text-[11px] leading-[16.5px]">
                {stat.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[14px] leading-5 font-bold",
                  STAT_VALUE_COLOR[stat.variant ?? "default"],
                )}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 차트 */}
      <div className="mt-3 h-[132px] min-w-0">
        <AnalyticsChart data={chartData} />
      </div>
    </div>
  );
}
