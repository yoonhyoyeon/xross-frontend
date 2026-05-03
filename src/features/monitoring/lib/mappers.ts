import type {
  EventResponse,
  EventDetailResponse,
  EventType,
  EventDetailType,
  EventSource,
  EventDetailStatus,
} from "@/features/monitoring/api/monitoring.types";
import type {
  DetectionEvent,
  EventSeverity,
  EventTag,
  VerificationItem,
  LogEntry,
  LogEntrySource,
  VerificationStatus,
} from "@/features/monitoring/types/monitoring.types";

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  ENTER: "고객 입장",
  EXIT: "고객 퇴장",
  PICK: "상품 집기 감지",
  PUT: "상품 반납",
  PAYMENT: "결제 완료",
  WEIGHT_CHANGE: "무게 변화 감지",
  ALERT: "이상 감지",
};

const DETAIL_TYPE_LABEL: Record<EventDetailType, string> = {
  CUSTOMER_ENTER: "고객 입장",
  CUSTOMER_EXIT: "고객 퇴장",
  ITEM_PICKED: "상품 집기",
  ITEM_RETURNED: "상품 반납",
  WEIGHT_CHANGE: "무게 변화",
  PAYMENT_COMPLETED: "결제 완료",
};

export function getAlertSeverity(
  status: "PENDING" | "SENT" | "ACKNOWLEDGED" | "RESOLVED",
): "critical" | "info" {
  return status === "PENDING" || status === "SENT" ? "critical" : "info";
}

function getSeverity(type: EventType): EventSeverity {
  if (type === "ALERT") return "critical";
  if (type === "PICK" || type === "WEIGHT_CHANGE") return "warning";
  return "info";
}

function getTag(source: EventSource): EventTag | null {
  if (source === "CEILING_CAMERA" || source === "FREEZER_CAMERA") {
    return { type: "ai-pick", label: "AI 감지" };
  }
  if (source === "WEIGHT_SENSOR") {
    return { type: "sensor", label: "무게 센서" };
  }
  if (source === "POS") {
    return { type: "pos-match", label: "POS" };
  }
  return null;
}

function buildEventDescription(e: EventResponse): string {
  switch (e.type) {
    case "ENTER":
      return "매장에 고객이 입장했습니다.";
    case "EXIT":
      return "고객이 매장에서 퇴장했습니다.";
    case "PICK":
      return `${e.product?.name ?? "상품"}을(를) 집었습니다.${e.freezer ? ` (${e.freezer.code})` : ""}`;
    case "PUT":
      return `${e.product?.name ?? "상품"}을(를) 반납했습니다.`;
    case "PAYMENT":
      return "POS 결제가 완료되었습니다.";
    case "WEIGHT_CHANGE":
      return e.weightBeforeG != null && e.weightAfterG != null
        ? `무게 변화: ${e.weightBeforeG}g → ${e.weightAfterG}g`
        : "냉동고 무게 변화가 감지되었습니다.";
    case "ALERT":
      return e.message ?? "미결제 퇴장 의심";
  }
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function mapEventToDetectionEvent(e: EventResponse): DetectionEvent {
  const tag = getTag(e.source);
  return {
    id: String(e.id),
    title: EVENT_TYPE_LABEL[e.type],
    timestamp: formatTime(e.occurredAt),
    severity: getSeverity(e.type),
    description: buildEventDescription(e),
    tags: tag ? [tag] : undefined,
  };
}

type SourceMapping = { logSource: LogEntrySource; label: string };

const SOURCE_MAP: Record<EventSource, SourceMapping> = {
  CEILING_CAMERA: { logSource: "vision", label: "비전 AI 감지 (천장)" },
  FREEZER_CAMERA: { logSource: "vision", label: "비전 AI 감지 (냉동고)" },
  WEIGHT_SENSOR: { logSource: "weight", label: "무게 센서" },
  POS: { logSource: "pos", label: "POS 결제" },
};

function mapDetailStatus(status: EventDetailStatus): VerificationStatus {
  if (status === "MATCHED") return "match";
  if (status === "PROCESSED") return "detected";
  if (status === "PENDING") return "pending";
  return "n/a";
}

function buildDetailText(d: EventDetailResponse): string {
  if (d.weightDeltaG != null) {
    return `무게 변화: ${d.weightDeltaG > 0 ? "+" : ""}${d.weightDeltaG}g`;
  }
  if (d.detectedProductSku) {
    return `감지 SKU: ${d.detectedProductSku}`;
  }
  if (d.confidence != null) {
    return `신뢰도: ${Math.round(d.confidence * 100)}%`;
  }
  return DETAIL_TYPE_LABEL[d.type];
}

export function mapEventDetailsToVerification(
  details: EventDetailResponse[],
): VerificationItem[] {
  return details
    .filter((d) => d.status !== "IGNORED")
    .map((d) => {
      const mapping = SOURCE_MAP[d.source];
      return {
        source: mapping.logSource,
        label: mapping.label,
        status: mapDetailStatus(d.status),
        detail: buildDetailText(d),
      };
    });
}

export function mapEventDetailsToLogEntries(
  details: EventDetailResponse[],
): LogEntry[] {
  return [...details]
    .sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    )
    .map((d) => {
      const { logSource, label } = SOURCE_MAP[d.source];
      const typeLabel = DETAIL_TYPE_LABEL[d.type];
      const isAlert = d.status === "PENDING" || d.status === "ERROR";
      return {
        time: formatTime(d.occurredAt),
        source: logSource,
        message: `${label}: ${typeLabel}`,
        alert: isAlert ? ("warning" as const) : undefined,
      };
    });
}
