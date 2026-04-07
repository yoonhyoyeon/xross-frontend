import { useParams, Navigate } from "react-router";
import EventDetailHeader from "@/features/monitoring/components/event-detail/EventDetailHeader";
import EventCCTVPlayer from "@/features/monitoring/components/event-detail/EventCCTVPlayer";
import EventDetailPanel from "@/features/monitoring/components/event-detail/EventDetailPanel";
import { MOCK_EVENT_DETAIL_MAP } from "@/features/monitoring/data/monitoring.mock";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  // TODO: 실제 API 연동 시 id로 데이터 fetch
  const event = id ? MOCK_EVENT_DETAIL_MAP[id] ?? null : null;

  if (!event) {
    return <Navigate to="/monitoring" replace />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-monitor-card-bg">
      <EventDetailHeader eventId={event.id} />

      <main className="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
        <EventCCTVPlayer
          cameraName={event.cameraName}
          timestamp={event.timestamp}
        />
        <EventDetailPanel event={event} />
      </main>
    </div>
  );
}
