import ShieldIcon from "@/assets/icons/shield.svg?react";

interface MonitoringHeaderProps {
  storeId?: string;
}

export default function MonitoringHeader({
  storeId = "KOR-강남점",
}: MonitoringHeaderProps) {
  return (
    <header className="bg-surface-page border-input-border relative flex h-14 shrink-0 items-center border-b">
      {/* 좌측: 타이틀 */}
      <div className="text-brand-primary flex items-center gap-2 pl-4 sm:pl-6">
        <ShieldIcon className="h-5 w-5 shrink-0" />
        <span className="text-dashboard-title text-[14px] leading-5 font-bold tracking-[0.2px] whitespace-nowrap">
          XROSS 통합 관제
        </span>
      </div>

      {/* 우측: 매장 ID */}
      <div className="ml-auto pr-4 lg:pr-6">
        <span className="text-dashboard-subtitle text-[12px] leading-4 font-medium whitespace-nowrap">
          매장 ID: {storeId}
        </span>
      </div>
    </header>
  );
}
