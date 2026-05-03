import { useParams, Navigate, useNavigate } from "react-router";
import { useQueries } from "@tanstack/react-query";
import EventDetailHeader from "@/features/monitoring/components/event-detail/EventDetailHeader";
import EventCCTVPlayer from "@/features/monitoring/components/event-detail/EventCCTVPlayer";
import EventDetailPanel from "@/features/monitoring/components/event-detail/EventDetailPanel";
import { useAlert } from "@/features/monitoring/hooks/useAlert";
import { useEvents } from "@/features/monitoring/hooks/useEvents";
import { getEventDetails } from "@/features/monitoring/api/monitoring.api";
import { monitoringQueryKeys } from "@/features/monitoring/lib/queryKeys";
import {
  mapEventToDetectionEvent,
  mapEventDetailsToVerification,
  mapEventDetailsToLogEntries,
  getAlertSeverity,
} from "@/features/monitoring/lib/mappers";
import type { EventDetail } from "@/features/monitoring/types/monitoring.types";
import type {
  EventSource,
  EventDetailResponse,
} from "@/features/monitoring/api/monitoring.types";

const SOURCE_CAMERA_NAME: Record<EventSource, string> = {
  CEILING_CAMERA: "천장 카메라",
  FREEZER_CAMERA: "냉동고 카메라",
  WEIGHT_SENSOR: "무게 센서",
  POS: "POS",
};

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alertId = Number(id);

  if (!alertId) return <Navigate to="/monitoring" replace />;

  const { data: alert, isLoading: alertLoading } = useAlert(alertId);
  const { data: events = [] } = useEvents();

  const detailQueries = useQueries({
    queries: (alert?.relatedEventIds ?? []).map((eid) => ({
      queryKey: monitoringQueryKeys.eventDetails(eid),
      queryFn: () => getEventDetails(eid),
      enabled: !!alert,
    })),
  });

  const detailsLoading = detailQueries.some((q) => q.isLoading);
  const isLoading = alertLoading || (!!alert?.relatedEventIds.length && detailsLoading);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-monitor-card-bg">
        <span className="text-sm text-monitor-text-muted">로딩 중...</span>
      </div>
    );
  }

  if (!alert || !alert.relatedEventIds.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-monitor-card-bg">
        <span className="text-sm text-monitor-text-muted">
          알림 데이터가 없습니다.
        </span>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-monitor-accent-blue hover:underline"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  // 모든 relatedEventIds의 event-details 합산
  const allDetails = detailQueries.flatMap(
    (q) => (q.data as EventDetailResponse[] | undefined) ?? [],
  );

  // 카메라·신뢰도는 첫 번째 이벤트 기준
  const primaryEventId = alert.relatedEventIds[0];
  const primaryEvent = events.find((e) => e.id === primaryEventId);
  const detectionEvent = primaryEvent
    ? mapEventToDetectionEvent(primaryEvent)
    : null;

  const cameraSource =
    allDetails.find(
      (d) => d.source === "CEILING_CAMERA" || d.source === "FREEZER_CAMERA",
    )?.source ??
    allDetails[0]?.source ??
    "CEILING_CAMERA";

  const confidence =
    primaryEvent?.confidence != null
      ? Math.round(primaryEvent.confidence * 100)
      : Math.round(
          (allDetails.find((d) => d.confidence != null)?.confidence ?? 0) * 100,
        );

  const eventDetail: EventDetail = {
    id: String(primaryEventId),
    title: detectionEvent?.title ?? alert.title,
    timestamp: detectionEvent?.timestamp ?? "",
    severity: getAlertSeverity(alert.status),
    description: detectionEvent?.description ?? alert.message,
    tags: detectionEvent?.tags,
    cameraId: cameraSource,
    cameraName: SOURCE_CAMERA_NAME[cameraSource as EventSource],
    confidence,
    verification: mapEventDetailsToVerification(allDetails),
    logEntries: mapEventDetailsToLogEntries(allDetails),
    showActions: getAlertSeverity(alert.status) === "critical",
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-monitor-card-bg">
      <EventDetailHeader eventId={`ALERT #${alertId}`} />

      <main className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <EventCCTVPlayer
          cameraName={eventDetail.cameraName}
          timestamp={eventDetail.timestamp}
        />
        <EventDetailPanel event={eventDetail} />
      </main>
    </div>
  );
}
