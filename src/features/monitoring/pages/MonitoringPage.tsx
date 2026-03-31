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

export default function MonitoringPage() {
  return (
    <>
      <MonitoringHeader />
      <main className="bg-monitor-bg flex flex-1 overflow-hidden">
        {/* 좌측: 카메라 그리드 + 분석 통계 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 카메라 그리드 */}
          <div className="flex-1 overflow-hidden">
            <CameraGrid cameras={MOCK_CAMERAS} />
          </div>
          {/* 분석 통계 */}
          <AnalyticsPanel
            stats={MOCK_ANALYTICS_STATS}
            chartData={MOCK_ANALYTICS_DATA}
          />
        </div>

        {/* 우측: 실시간 탐지 로그 */}
        <EventLogPanel events={MOCK_EVENTS} />
      </main>
    </>
  );
}
