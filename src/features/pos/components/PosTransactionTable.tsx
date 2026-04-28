import { useState } from "react";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg?react";
import ExternalLinkIcon from "@/assets/icons/external-link.svg?react";
import PosStatusBadge from "@/features/pos/components/PosStatusBadge";
import PosPaymentMethod from "@/features/pos/components/PosPaymentMethod";
import type { PosTransaction } from "@/features/pos/types/pos.types";

/* ── 금액 포맷 ──────────────────────────────── */
function formatAmount(amount: number | null): React.ReactNode {
  if (amount === null) {
    return (
      <span className="font-['Menlo',monospace] text-[14px] font-bold text-[#ff6467]">
        — 미결제 —
      </span>
    );
  }
  return (
    <span className="text-monitor-text text-[14px] font-semibold">
      {amount.toLocaleString("ko-KR")}원
    </span>
  );
}

/* ── 확장 상세 패널 ──────────────────────────── */
interface TransactionDetailProps {
  tx: PosTransaction;
}

function TransactionDetail({ tx }: TransactionDetailProps) {
  const total = tx.items.reduce((sum, item) => sum + item.subtotal, 0);

  const isUnpaid = tx.status === "unpaid";

  return (
    <tr className="border-monitor-border border-b">
      <td
        colSpan={7}
        className={`px-6 py-[8.5px] ${
          isUnpaid ? "bg-[rgba(251,44,54,0.06)]" : "bg-[rgba(255,255,255,0.03)]"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          {/* 구매 상품 */}
          <div className="flex-1 overflow-x-auto">
            <p className="text-monitor-text-dim mb-[9px] text-[11px] font-medium tracking-wider uppercase">
              구매 상품
            </p>
            {tx.items.length === 0 ? (
              <p className="text-monitor-text-muted text-[13px]">
                결제된 상품 없음
              </p>
            ) : (
              <table className="w-full max-w-[814px]">
                <thead>
                  <tr className="border-monitor-border border-b">
                    <th className="text-monitor-text-dim pb-[7px] text-left text-[11px] font-medium">
                      상품명
                    </th>
                    <th className="text-monitor-text-dim w-10 pb-[7px] text-right text-[11px] font-medium">
                      수량
                    </th>
                    <th className="text-monitor-text-dim w-20 pb-[7px] text-right text-[11px] font-medium">
                      단가
                    </th>
                    <th className="text-monitor-text-dim w-20 pb-[7px] text-right text-[11px] font-medium">
                      소계
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tx.items.map((item, i) => (
                    <tr key={i} className="border-monitor-border border-b">
                      <td className="text-monitor-text py-[4.5px] text-[13px]">
                        {item.name}
                      </td>
                      <td className="text-monitor-text py-[4.5px] text-right text-[13px]">
                        {item.quantity}
                      </td>
                      <td className="text-monitor-text py-[4.5px] text-right text-[13px]">
                        {item.unitPrice.toLocaleString("ko-KR")}원
                      </td>
                      <td className="text-monitor-text py-[4.5px] text-right text-[13px]">
                        {item.subtotal.toLocaleString("ko-KR")}원
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      className="text-monitor-text-dim pt-[6px] text-right text-[11px] font-medium"
                    >
                      합계
                    </td>
                    <td className="text-monitor-text pt-[6px] text-right text-[13px] font-semibold">
                      {total.toLocaleString("ko-KR")}원
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="w-full shrink-0 sm:w-[224px]">
            <p className="text-monitor-text-dim mb-[8px] text-[11px] font-medium tracking-wider uppercase">
              상세 정보
            </p>
            <div className="flex flex-col gap-[8px]">
              {tx.trackingId && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-monitor-text-dim">비전 AI 추적 ID</span>
                  <span className="text-monitor-text-muted font-medium">
                    {tx.trackingId}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[13px]">
                <span className="text-monitor-text-dim">결제 수단</span>
                <span className="text-monitor-text-muted">
                  {tx.paymentMethod === "card"
                    ? "카드"
                    : tx.paymentMethod === "cash"
                      ? "현금"
                      : "모바일"}
                </span>
              </div>
              {tx.note && (
                <div
                  className={`mt-1 rounded-md border px-[11px] py-[11px] ${
                    tx.status === "unpaid"
                      ? "border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.08)]"
                      : "border-monitor-border bg-[rgba(254,154,0,0.07)]"
                  }`}
                >
                  <p
                    className={`text-[11px] leading-[17px] ${
                      tx.status === "unpaid"
                        ? "text-[#ff6467]"
                        : "text-event-warning"
                    }`}
                  >
                    {tx.note}
                  </p>
                </div>
              )}
              {tx.linkedEventId && (
                <button
                  type="button"
                  className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-[8px] text-[12px] font-medium transition-colors ${
                    tx.status === "unpaid"
                      ? "border-[rgba(251,44,54,0.3)] bg-[rgba(251,44,54,0.08)] text-[#ff6467] hover:bg-[rgba(251,44,54,0.15)]"
                      : "border-monitor-accent-blue/30 bg-monitor-accent-blue/5 text-monitor-accent-blue hover:bg-monitor-accent-blue/10"
                  }`}
                >
                  <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                  연계 이벤트 상세 검토 →
                </button>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ── 트랜잭션 행 ─────────────────────────────── */
interface TransactionRowProps {
  tx: PosTransaction;
  isExpanded: boolean;
  onToggle: () => void;
}

function TransactionRow({ tx, isExpanded, onToggle }: TransactionRowProps) {
  const ChevronIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
  const isUnpaid = tx.status === "unpaid";

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-monitor-border cursor-pointer border-b transition-colors ${
          isUnpaid
            ? "bg-[rgba(251,44,54,0.08)] hover:bg-[rgba(251,44,54,0.13)]"
            : isExpanded
              ? "bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.05)]"
              : "hover:bg-[rgba(255,255,255,0.03)]"
        }`}
      >
        {/* 시각 / ID */}
        <td className="px-4 py-[12.5px]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-monitor-text text-[13px] leading-4 font-medium">
              {tx.time}
            </span>
            <span className="text-monitor-text-dim font-mono text-[11px] leading-[15px]">
              {tx.id}
            </span>
          </div>
        </td>

        {/* 날짜 */}
        <td className="px-4 py-[12.5px]">
          <span className="text-monitor-text-muted text-[13px] leading-4">
            {tx.date}
          </span>
        </td>

        {/* 결제 수단 */}
        <td className="px-4 py-[12.5px]">
          <PosPaymentMethod method={tx.paymentMethod} />
        </td>

        {/* 금액 */}
        <td className="px-4 py-[12.5px] text-right">
          <span className="text-[15px] leading-5">
            {formatAmount(tx.amount)}
          </span>
        </td>

        {/* 상태 */}
        <td className="px-4 py-[12.5px]">
          <PosStatusBadge status={tx.status} />
        </td>

        {/* 연계 이벤트 */}
        <td className="px-4 py-[12.5px]">
          {tx.linkedEventId ? (
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-[5px] rounded-[4px] border px-[9px] py-[2px] font-mono text-[10px] font-medium transition-colors ${
                isUnpaid
                  ? "border-[rgba(251,44,54,0.2)] bg-[rgba(251,44,54,0.1)] text-[#ff6467] hover:bg-[rgba(251,44,54,0.18)]"
                  : "border-monitor-accent-blue/30 text-monitor-accent-blue hover:bg-monitor-accent-blue/10"
              }`}
            >
              <ExternalLinkIcon className="h-3 w-3 shrink-0" />
              {tx.linkedEventId}
            </button>
          ) : (
            <span className="text-monitor-text-dim text-[13px]">—</span>
          )}
        </td>

        {/* 확장 토글 */}
        <td className="px-4 py-[12.5px]">
          <div className="flex items-center justify-center">
            <ChevronIcon className="text-monitor-text-dim h-[14px] w-[14px]" />
          </div>
        </td>
      </tr>

      {isExpanded && <TransactionDetail tx={tx} />}
    </>
  );
}

/* ── PosTransactionTable ─────────────────────── */
interface PosTransactionTableProps {
  transactions: PosTransaction[];
  totalCount: number;
}

const COL_HEADERS = [
  { label: "시각 / ID", align: "left" as const },
  { label: "날짜", align: "left" as const },
  { label: "결제 수단", align: "left" as const },
  { label: "금액", align: "right" as const },
  { label: "상태", align: "left" as const },
  { label: "연계 이벤트", align: "left" as const },
  { label: "", align: "left" as const },
];

export default function PosTransactionTable({
  transactions,
  totalCount,
}: PosTransactionTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function handleToggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="border-monitor-border bg-monitor-card-bg overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          {/* 헤더 */}
          <thead>
            <tr className="border-monitor-border border-b bg-[rgba(255,255,255,0.04)]">
              {COL_HEADERS.map((col, i) => (
                <th
                  key={i}
                  className={`text-monitor-text-dim px-4 py-[10px] text-[11px] font-medium tracking-wider uppercase ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${i === COL_HEADERS.length - 1 ? "w-12" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* 바디 */}
          <tbody>
            {transactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isExpanded={expandedIds.has(tx.id)}
                onToggle={() => handleToggle(tx.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 푸터 */}
      <div className="border-monitor-border flex flex-col items-start gap-1 border-t px-4 py-[10px] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <span className="text-monitor-text-dim text-[12px]">
          {transactions.length}건 표시 중 (전체 {totalCount}건)
        </span>
        <span className="text-monitor-text-dim text-[11px]">
          행을 클릭하면 상품 상세 내역을 확인할 수 있습니다
        </span>
      </div>
    </div>
  );
}
