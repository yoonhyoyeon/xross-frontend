# Monitoring & Alert API 연동 계획

## Context
Auth 연동 완료 후 다음 단계로 모니터링 대시보드의 실시간 데이터를 백엔드에서 가져온다.
현재 `MonitoringPage`, `EventDetailPage`는 mock 데이터를 직접 import해서 사용 중이다.
이번 작업에서 **이벤트 목록 → 알림 목록 → 이벤트 상세** 순으로 API 연동을 구현한다.

POS 페이지는 swagger에 거래 조회 전용 엔드포인트가 없어 이번 플랜에서 제외한다.

---

## 연동할 API (swagger 기준)

| 엔드포인트 | 메서드 | 용도 |
|-----------|--------|------|
| `/events` | GET | 모니터링 이벤트 목록 |
| `/alerts` | GET | 알림 목록 (EventLogPanel) |
| `/event-details/event/{eventId}` | GET | 이벤트별 센서 상세 (EventDetailPage) |
| `/alerts/{id}/acknowledge` | POST | 알림 확인 처리 |

---

## 정확한 swagger 타입 정의

### `src/features/monitoring/api/monitoring.types.ts` 전체 내용

```ts
// ── 네스티드 타입 ──────────────────────────────────────────
export interface EventCustomerResponse {
  id: number;
  trackingKey: string;
  userId?: number | null;
}

export interface EventProductResponse {
  id: number;
  name: string;
  sku: string;
  price: number;
  weightPerUnitG: number;
}

export interface EventFreezerResponse {
  id: number;
  code: string;
  name?: string | null;
}

// ── 이벤트 목록 응답 ──────────────────────────────────────
export type EventType =
  | "ENTER" | "EXIT" | "PICK" | "PUT"
  | "PAYMENT" | "WEIGHT_CHANGE" | "ALERT";

export type EventSource =
  | "CEILING_CAMERA" | "FREEZER_CAMERA" | "WEIGHT_SENSOR" | "POS";

export interface EventResponse {
  id: number;
  type: EventType;
  source: EventSource;
  occurredAt: string;         // date-time
  createdAt: string;          // date-time
  storeId: number;
  quantityDelta?: number | null;
  weightBeforeG?: number | null;
  weightAfterG?: number | null;
  predictedItemCount?: number | null;
  confidence?: number | null;
  location?: unknown | null;
  message?: string | null;
  metadata?: unknown | null;
  customerId?: number | null;
  productId?: number | null;
  freezerId?: number | null;
  deviceId?: number | null;
  paymentId?: number | null;
  customer?: EventCustomerResponse | null;
  product?: EventProductResponse | null;
  freezer?: EventFreezerResponse | null;
}

// GET /events query params
export interface GetEventsParams {
  storeId: number;
  limit?: number;
  type?: | "CUSTOMER_ENTER" | "CUSTOMER_EXIT" | "ITEM_PICKED"
         | "ITEM_RETURNED" | "PAYMENT_COMPLETED" | "WEIGHT_MISMATCH" | "UNPAID_EXIT";
}

// ── 알림 응답 ─────────────────────────────────────────────
export type AlertChannel = "DASHBOARD" | "SMS" | "EMAIL" | "PUSH";
export type AlertStatus = "PENDING" | "SENT" | "ACKNOWLEDGED" | "RESOLVED";

export interface AlertResponse {
  id: number;
  title: string;
  message: string;
  channel: AlertChannel;
  status: AlertStatus;
  storeId: number;
  createdAt: string;          // date-time
  customerId?: number | null;
  eventId?: number | null;
}

// ── 이벤트 상세 응답 ──────────────────────────────────────
export type EventDetailType =
  | "CUSTOMER_ENTER" | "CUSTOMER_EXIT" | "ITEM_PICKED"
  | "ITEM_RETURNED" | "WEIGHT_CHANGE" | "PAYMENT_COMPLETED";

export type EventDetailStatus =
  | "PENDING" | "PROCESSED" | "MATCHED" | "IGNORED" | "ERROR";

export interface EventDetailResponse {
  id: number;
  type: EventDetailType;
  source: EventSource;        // 같은 열거형 재사용
  status: EventDetailStatus;
  occurredAt: string;         // date-time
  createdAt: string;          // date-time
  storeId?: number;
  customerId?: number | null;
  freezerId?: number | null;
  productId?: number | null;
  matchedEventId?: number | null;
  detectedProductSku?: string | null;
  action?: string | null;     // "pick" | "return"
  confidence?: number | null;
  weightBeforeG?: number | null;
  weightAfterG?: number | null;
  weightDeltaG?: number | null;
  processedAt?: string | null;
  errorMessage?: string | null;
}
```

---

## API → 프론트 타입 매핑 규칙

### EventResponse → DetectionEvent

severity 결정 (type 기준):
- `ALERT` → `"critical"`
- `PICK` → `"warning"` (절도 의심)
- `WEIGHT_CHANGE` → `"warning"` (무게 이상)
- `PUT` → `"info"` (반납)
- `ENTER` / `EXIT` / `PAYMENT` → `"info"`

tag 결정 (source 기준):
- `CEILING_CAMERA` / `FREEZER_CAMERA` → `{ type: "ai-pick", label: "AI 감지" }`
- `WEIGHT_SENSOR` → `{ type: "sensor", label: "무게 센서" }`
- `POS` → `{ type: "pos-match", label: "POS" }`

title/description 결정:
- `PICK` → "상품 집기 감지", `product?.name ?? "상품"` 포함
- `ALERT` → event.message 사용, 없으면 "미결제 퇴장 의심"
- 나머지 → type 한글 매핑 테이블

### EventDetailResponse[] → VerificationItem[]

source별 그룹화 → verification 카드:
- `CEILING_CAMERA` / `FREEZER_CAMERA` → source: `"vision"`, label: `"비전 AI 감지"`
- `WEIGHT_SENSOR` → source: `"weight"`, label: `"무게 센서"`
- `POS` → source: `"pos"`, label: `"POS 결제"`

status 매핑 (`EventDetailStatus` → `VerificationStatus`):
- `MATCHED` → `"match"`
- `PROCESSED` → `"detected"`
- `PENDING` → `"pending"`
- `ERROR` / `IGNORED` → `"n/a"`

### EventDetailResponse[] → LogEntry[]

각 항목을 시간순 정렬 후 로그 메시지 생성:
- `type + status` 조합으로 message 구성 (예: "비전 AI: 상품 집기 감지됨")
- `MATCHED` → alert 없음, `PENDING`/`ERROR` → alert: `"warning"`

### AlertResponse → EventLogPanel

`EventLogPanel`이 `AlertResponse[]`를 직접 받도록 props 교체:
- `criticalCount`: `alerts.filter(a => a.status === "PENDING" || a.status === "SENT").length`
- `status === "ACKNOWLEDGED"` → 카드 스타일 dimmed 처리

---

## 구현 순서

### 1. Query Keys
**파일:** `src/features/monitoring/lib/queryKeys.ts` (신규)

```ts
export const monitoringQueryKeys = {
  events: (storeId: number) => ["monitoring", "events", storeId] as const,
  alerts: (storeId: number) => ["monitoring", "alerts", storeId] as const,
  eventDetails: (eventId: number) => ["monitoring", "event-details", eventId] as const,
};
```

### 2. API 타입 정의
**파일:** `src/features/monitoring/api/monitoring.types.ts` (신규)

### 3. API 함수
**파일:** `src/features/monitoring/api/monitoring.api.ts` (신규)

```ts
import { apiFetch } from "@/shared/lib/api";

export function getEvents(storeId: number, limit = 50): Promise<EventResponse[]> {
  return apiFetch(`/events?storeId=${storeId}&limit=${limit}`);
}

export function getAlerts(storeId: number): Promise<AlertResponse[]> {
  return apiFetch(`/alerts?storeId=${storeId}`);
}

export function getEventDetails(eventId: number): Promise<EventDetailResponse[]> {
  return apiFetch(`/event-details/event/${eventId}`);
}

export function acknowledgeAlert(alertId: number, userId: number): Promise<AlertResponse> {
  return apiFetch(`/alerts/${alertId}/acknowledge`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}
```

### 4. 매퍼 함수
**파일:** `src/features/monitoring/lib/mappers.ts` (신규)

```ts
export function mapEventToDetectionEvent(e: EventResponse): DetectionEvent
export function mapEventDetailsToVerification(details: EventDetailResponse[]): VerificationItem[]
export function mapEventDetailsToLogEntries(details: EventDetailResponse[]): LogEntry[]
```

### 5. React Query 훅
3개 파일 신규. 공통 패턴:

```ts
const storeId = useMe().data?.storeId;
return useQuery({
  queryKey: monitoringQueryKeys.events(storeId!),
  queryFn: () => getEvents(storeId!),
  enabled: !!storeId,
  refetchInterval: 30_000,
});
```

`useEventDetails(eventId: number)` — `refetchInterval` 없음.

### 6. MonitoringPage 업데이트
**파일:** `src/features/monitoring/pages/MonitoringPage.tsx`

- `MOCK_EVENTS`, `MOCK_ANALYTICS_DATA`, `MOCK_ANALYTICS_STATS` import 제거
- `useEvents()`, `useAlerts()` 훅으로 교체
- `MOCK_CAMERAS` 유지 (카메라 목록 API 없음)
- analytics stats/chart: events 배열에서 클라이언트 집계
- `EventLogPanel`에 `alerts` 데이터 전달

### 7. EventDetailPage 업데이트
**파일:** `src/features/monitoring/pages/EventDetailPage.tsx`

- `MOCK_EVENT_DETAIL_MAP` import 제거
- `useEventDetails(Number(id))` 호출
- 매퍼로 변환 → verification + logEntries 구성
- `isLoading` 시 로딩 스피너, `details.length === 0` 시 Navigate

### 8. EventLogPanel props 변경
**파일:** `src/features/monitoring/components/EventLogPanel.tsx`

- `events: DetectionEvent[]` → `alerts: AlertResponse[]`로 교체

---

## 수정/생성 파일 목록

| 파일 | 작업 |
|------|------|
| `src/features/monitoring/lib/queryKeys.ts` | 신규 |
| `src/features/monitoring/api/monitoring.types.ts` | 신규 |
| `src/features/monitoring/api/monitoring.api.ts` | 신규 |
| `src/features/monitoring/lib/mappers.ts` | 신규 |
| `src/features/monitoring/hooks/useEvents.ts` | 신규 |
| `src/features/monitoring/hooks/useAlerts.ts` | 신규 |
| `src/features/monitoring/hooks/useEventDetails.ts` | 신규 |
| `src/features/monitoring/pages/MonitoringPage.tsx` | 수정 |
| `src/features/monitoring/pages/EventDetailPage.tsx` | 수정 |
| `src/features/monitoring/components/EventLogPanel.tsx` | 수정 |
| `src/features/monitoring/components/EventCard.tsx` | 수정 (AlertResponse 기반) |

---

## 재사용할 기존 코드

- `apiFetch` — `src/shared/lib/api.ts`
- `useMe` — `src/features/auth/hooks/useMe.ts` (storeId 획득)
- `CameraFeedLoading` — `src/features/monitoring/components/CameraFeedLoading.tsx`

---

## 검증 방법

1. `npm run dev` 후 로그인 → 모니터링 페이지 접근
2. Network 탭에서 `GET /events?storeId=N&limit=50`, `GET /alerts?storeId=N` 요청 확인
3. 이벤트 카드 클릭 → `GET /event-details/event/{id}` 요청 확인
4. 30초 후 자동 refetch 확인
5. `npx tsc --noEmit` 타입 에러 없음 확인
