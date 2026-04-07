import { useState, useMemo } from "react";
import PosHeader from "@/features/pos/components/PosHeader";
import PosSummaryCards from "@/features/pos/components/PosSummaryCards";
import PosSearchBar, {
  type PosFilters,
} from "@/features/pos/components/PosSearchBar";
import PosTransactionTable from "@/features/pos/components/PosTransactionTable";
import {
  MOCK_POS_TRANSACTIONS,
  MOCK_POS_SUMMARY,
} from "@/features/pos/data/pos.mock";
import type { PosTransaction } from "@/features/pos/types/pos.types";

function filterTransactions(
  transactions: PosTransaction[],
  filters: PosFilters,
): PosTransaction[] {
  return transactions.filter((tx) => {
    /* 검색어 */
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        tx.id.toLowerCase().includes(q) ||
        tx.trackingId?.toLowerCase().includes(q) ||
        tx.items.some((item) => item.name.toLowerCase().includes(q));
      if (!match) return false;
    }

    /* 날짜 범위 */
    const { from, to } = filters.dateRange;
    if (from && tx.date < from) return false;
    if (to && tx.date > to) return false;

    /* 상태 */
    if (filters.status !== "all" && tx.status !== filters.status) return false;

    /* 결제 수단 */
    if (filters.payment !== "all" && tx.paymentMethod !== filters.payment)
      return false;

    return true;
  });
}

export default function PosPage() {
  const [filters, setFilters] = useState<PosFilters>({
    search: "",
    dateRange: { from: null, to: null },
    status: "all",
    payment: "all",
  });
  const filtered = useMemo(
    () => filterTransactions(MOCK_POS_TRANSACTIONS, filters),
    [filters],
  );

  return (
    <>
      <PosHeader />
      <main className="bg-monitor-bg flex flex-1 flex-col overflow-auto">
        <div className="mx-auto w-full max-w-[1152px] px-3 py-4 sm:px-6 sm:py-6">
          {/* 요약 카드 */}
          <PosSummaryCards stats={MOCK_POS_SUMMARY} />

          {/* 검색 + 필터 */}
          <div className="mt-[28px]">
            <PosSearchBar filters={filters} onChange={setFilters} />
          </div>

          {/* 거래 테이블 */}
          <div className="mt-4">
            <PosTransactionTable
              transactions={filtered}
              totalCount={MOCK_POS_TRANSACTIONS.length}
            />
          </div>
        </div>
      </main>
    </>
  );
}
