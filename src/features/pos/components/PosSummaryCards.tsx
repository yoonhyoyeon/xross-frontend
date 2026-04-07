import ReceiptIcon from "@/assets/icons/receipt.svg?react";
import TrendingUpIcon from "@/assets/icons/trending-up.svg?react";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import RotateCcwIcon from "@/assets/icons/rotate-ccw.svg?react";
import type { PosSummaryStats } from "@/features/pos/types/pos.types";

function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
}

function SummaryCard({
  icon,
  title,
  value,
  sub,
  accentClass,
  borderClass,
  bgClass,
}: SummaryCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col gap-0 rounded-xl border px-[17px] py-[17px] ${borderClass} ${bgClass}`}
    >
      {/* 제목 + 아이콘 */}
      <div className="flex items-center justify-between">
        <span className={`text-[12px] leading-4 font-medium ${accentClass}`}>
          {title}
        </span>
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center ${accentClass}`}
        >
          {icon}
        </span>
      </div>
      {/* 수치 */}
      <div className="mt-[9px]">
        <span className="text-monitor-text text-[22px] leading-7 font-bold tracking-[-0.3px]">
          {value}
        </span>
      </div>
      {/* 부제 */}
      <div className="mt-[6px]">
        <span className="text-monitor-text-dim text-[11px] leading-[17px]">
          {sub}
        </span>
      </div>
    </div>
  );
}

interface PosSummaryCardsProps {
  stats: PosSummaryStats;
}

export default function PosSummaryCards({ stats }: PosSummaryCardsProps) {
  return (
    <div className="flex gap-[12px]">
      <SummaryCard
        icon={<ReceiptIcon className="h-full w-full" aria-hidden />}
        title="총 거래"
        value={`${stats.totalCount}건`}
        sub="필터 기간 내"
        accentClass="text-monitor-accent-blue"
        borderClass="border-[rgba(81,162,255,0.25)]"
        bgClass="bg-[rgba(81,162,255,0.08)]"
      />
      <SummaryCard
        icon={<TrendingUpIcon className="h-full w-full" aria-hidden />}
        title="정상 매출"
        value={formatAmount(stats.normalAmount)}
        sub={`${stats.normalCount}건`}
        accentClass="text-monitor-accent-green"
        borderClass="border-[rgba(0,212,146,0.25)]"
        bgClass="bg-[rgba(0,212,146,0.08)]"
      />
      <SummaryCard
        icon={<ShieldAlertIcon className="h-full w-full" aria-hidden />}
        title="미결제 의심"
        value={`${stats.unpaidCount}건`}
        sub="교차 검증 실패"
        accentClass="text-event-critical"
        borderClass="border-[rgba(255,100,103,0.25)]"
        bgClass="bg-[rgba(255,100,103,0.08)]"
      />
      <SummaryCard
        icon={<RotateCcwIcon className="h-full w-full" aria-hidden />}
        title="환불 처리"
        value={formatAmount(stats.refundAmount)}
        sub={`${stats.refundCount}건`}
        accentClass="text-event-warning"
        borderClass="border-[rgba(254,154,0,0.25)]"
        bgClass="bg-[rgba(254,154,0,0.08)]"
      />
    </div>
  );
}
