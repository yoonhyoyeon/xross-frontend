import MonitoringHeader from "@/features/monitoring/components/MonitoringHeader";

export default function MonitoringPage() {
  return (
    <>
      <MonitoringHeader />
      <main className="flex-1 overflow-auto">
        {/* TODO: 대시보드 콘텐츠 (카메라 그리드, 분석 통계, 이벤트 타임라인) */}
        <div className="text-muted flex h-full items-center justify-center text-sm">
          콘텐츠 준비 중...
        </div>
      </main>
    </>
  );
}
