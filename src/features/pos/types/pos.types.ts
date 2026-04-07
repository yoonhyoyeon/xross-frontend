export type TransactionStatus = "normal" | "unpaid" | "refund";
export type PaymentMethod = "card" | "cash" | "mobile";

export interface DateRange {
  from: string | null;
  to: string | null;
}

export type StatusFilterOption = "all" | "normal" | "unpaid" | "refund";
export type PaymentFilterOption = "all" | "card" | "cash" | "mobile";

export interface PurchaseItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PosTransaction {
  id: string;
  time: string;
  date: string;
  paymentMethod: PaymentMethod;
  /** null 이면 미결제 */
  amount: number | null;
  status: TransactionStatus;
  linkedEventId: string | null;
  trackingId: string | null;
  items: PurchaseItem[];
  note?: string;
}

export interface PosSummaryStats {
  totalCount: number;
  normalAmount: number;
  normalCount: number;
  unpaidCount: number;
  refundAmount: number;
  refundCount: number;
}
