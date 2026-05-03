# 미구현 백엔드 엔드포인트 정리

## 1. `GET /auth/me` — 가장 critical

`useMe` 훅이 이 엔드포인트를 호출합니다. `storeId`를 가져오는 데 사용되므로, 이게 없으면 **페이지 새로고침 시 모든 모니터링/알림 API가 동작 안 합니다.**

현재 로그인 직후에는 `queryClient.setQueryData`로 캐시에 넣어서 동작하지만, 새로고침하면 캐시가 사라지고 API 호출 → 404 → storeId = undefined → 모든 쿼리 `enabled: false` 상태가 됩니다.

```
GET /auth/me   → UserResponse
```

---

## 2. `GET /events/{id}` — 없음

이벤트 단건 조회 엔드포인트가 없습니다. `EventDetailPage`에서 현재 `GET /events?storeId=N` 전체를 불러와 ID로 필터링하는 우회책을 쓰고 있습니다. 이벤트가 최근 50개 밖에 있으면 상세 페이지 헤더 데이터(title, severity 등)가 비어있게 됩니다.

```
GET /events/{id}   → EventResponse
```

---

## 3. `GET /pos/transactions` 또는 유사 — 없음

POS 내역 페이지 전체가 mock 데이터입니다. swagger에 거래 조회 엔드포인트 자체가 없습니다. PosPage 연동을 위해서는 아래 중 하나가 필요합니다:

```
GET /pos/transactions?storeId=N&from=&to=   → PosTransaction[]
또는
GET /events?storeId=N&type=PAYMENT_COMPLETED 으로 대체 가능 여부 검토 필요
```

---

## 4. 카메라 목록 API — 없음

`CameraGrid`가 현재 `MOCK_CAMERAS` 4개를 하드코딩합니다. 실제 매장별 카메라 목록을 가져올 엔드포인트가 없습니다.

```
GET /cameras?storeId=N   → CameraFeed[]
```

---

## 요약

| 엔드포인트 | 영향 범위 | 우선순위 |
|-----------|---------|---------|
| `GET /auth/me` | 새로고침 시 앱 전체 동작 불가 | **P0** |
| `GET /events/{id}` | EventDetailPage 헤더 데이터 누락 | P1 |
| `GET /pos/transactions` | POS 페이지 전체 미연동 | P1 |
| `GET /cameras` | 카메라 그리드 하드코딩 | P2 |
