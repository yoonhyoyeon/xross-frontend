import { useNavigate } from "react-router";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";

interface EventDetailHeaderProps {
  eventId: string;
}

export default function EventDetailHeader({ eventId }: EventDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="relative flex h-[56px] shrink-0 items-center border-b border-[#cad5e2] bg-surface-page px-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate("/monitoring")}
        className="flex items-center gap-2 text-dashboard-subtitle transition-colors hover:text-dashboard-title"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="text-[14px] font-semibold tracking-[0.55px]">
          관제 화면으로 복귀
        </span>
      </button>

      {/* 중앙: 페이지 타이틀 + 이벤트 ID */}
      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-[2px]">
        <span className="font-mono text-[10px] uppercase tracking-[1px] text-monitor-text-muted">
          이상 행동 상세 검토
        </span>
        <span className="text-[14px] font-bold tracking-[-0.15px] text-dashboard-title">
          {eventId}
        </span>
      </div>

      {/* 하단 blue gradient 라인 */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-[rgba(43,127,255,0.5)] via-[rgba(81,162,255,0.5)] to-transparent" />
    </header>
  );
}
