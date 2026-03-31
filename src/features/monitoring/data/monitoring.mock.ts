import type {
  CameraFeed,
  DetectionEvent,
  AnalyticsDataPoint,
} from "@/features/monitoring/types/monitoring.types";

export const MOCK_CAMERAS: CameraFeed[] = [
  {
    id: "cam-01",
    name: "냉동고 1구역",
    isOnline: true,
    isRecording: true,
  },
  {
    id: "cam-02",
    name: "스낵/주류 코너",
    isOnline: true,
    isRecording: true,
  },
  {
    id: "cam-03",
    name: "POS 셀프 계산대",
    isOnline: true,
    isRecording: true,
  },
  {
    id: "cam-04",
    name: "입구/출구",
    isOnline: true,
    isRecording: true,
  },
  // {
  //   id: "cam-05",
  //   name: "음료 코너",
  //   isOnline: false,
  //   isRecording: false,
  // },
  // {
  //   id: "cam-06",
  //   name: "계산대 1번",
  //   isOnline: true,
  //   isRecording: true,
  // },
  // {
  //   id: "cam-07",
  //   name: "계산대 2번",
  //   isOnline: true,
  //   isRecording: false,
  // },
  // {
  //   id: "cam-08",
  //   name: "창고 입구",
  //   isOnline: false,
  //   isRecording: false,
  // },
  // {
  //   id: "cam-09",
  //   name: "창고 입구",
  //   isOnline: false,
  //   isRecording: false,
  // },
];

export const MOCK_EVENTS: DetectionEvent[] = [
  {
    id: "evt-1042",
    title: "Pick · 미결제 퇴장",
    timestamp: "오후 07:55:05",
    severity: "critical",
    description:
      "상품 Pick 행동 및 선반 무게 감소 확인 후 POS 결제 내역 불일치.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-mismatch", label: "POS 불일치" },
    ],
  },
  {
    id: "evt-1035",
    title: "은닉 · 검증 대기",
    timestamp: "오후 07:52",
    severity: "warning",
    description:
      "Pick 행동 후 가방으로 상품 이동 궤적 감지. 퇴장 시 POS 데이터 교차 검증 예정.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-pending", label: "POS 대기" },
    ],
  },
  {
    id: "evt-1038",
    title: "은닉 · 미결제 퇴장",
    timestamp: "오후 07:54:50",
    severity: "critical",
    description:
      "은닉 행위 감지 고객이 POS 결제 없이 퇴장. 비전 AI/무게 센서/POS 3단계 교차 검증 실패.",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-mismatch", label: "POS 불일치" },
    ],
  },
  {
    id: "evt-0912",
    title: "쓰러짐 · 안전 경고",
    timestamp: "오후 07:10",
    severity: "behavior",
    description: "매장 중앙 통로에서 비정상적인 자세 5초 이상 유지.",
  },
  {
    id: "evt-0840",
    title: "Put Back · 정상 반환",
    timestamp: "오후 05:55",
    severity: "info",
    description: "상품을 집었다가 다시 선반에 내려놓음 (검증 완료).",
    tags: [
      { type: "ai-pick", label: "AI: Pick" },
      { type: "sensor", label: "Sensor" },
      { type: "pos-pending", label: "POS 대기" },
    ],
  },
];

export const MOCK_ANALYTICS_DATA: AnalyticsDataPoint[] = [
  { time: "08:00", picks: 12, suspicions: 0 },
  { time: "09:00", picks: 28, suspicions: 0 },
  { time: "10:00", picks: 45, suspicions: 1 },
  { time: "11:00", picks: 62, suspicions: 1 },
  { time: "12:00", picks: 88, suspicions: 1 },
  { time: "13:00", picks: 110, suspicions: 2 },
  { time: "14:00", picks: 145, suspicions: 2 },
  { time: "15:00", picks: 178, suspicions: 2 },
  { time: "16:00", picks: 210, suspicions: 3 },
  { time: "17:00", picks: 238, suspicions: 3 },
  { time: "18:00", picks: 252, suspicions: 3 },
  { time: "19:00", picks: 264, suspicions: 3 },
];

export const MOCK_ANALYTICS_STATS = [
  { label: "Pick 행동 인식", value: "264건", variant: "default" as const },
  {
    label: "미결제 의심 (불일치)",
    value: "3건",
    variant: "danger" as const,
  },
  { label: "예방된 손실액", value: "약 18,500원", variant: "success" as const },
];
