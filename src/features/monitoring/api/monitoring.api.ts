import { apiFetch } from "@/shared/lib/api";
import type {
  EventResponse,
  AlertResponse,
  EventDetailResponse,
} from "./monitoring.types";

export function getEvents(
  storeId: number,
  limit = 50,
): Promise<EventResponse[]> {
  return apiFetch(`/events?storeId=${storeId}`);
}

export function getEvent(eventId: number): Promise<EventResponse> {
  return apiFetch(`/events/${eventId}`);
}

export function getAlerts(storeId: number): Promise<AlertResponse[]> {
  return apiFetch(`/alerts?storeId=${storeId}`);
}

export function getAlert(alertId: number): Promise<AlertResponse> {
  return apiFetch(`/alerts/${alertId}`);
}

export function getEventDetails(
  eventId: number,
): Promise<EventDetailResponse[]> {
  return apiFetch(`/event-details/event/${eventId}`);
}

export function acknowledgeAlert(
  alertId: number,
  userId: number,
): Promise<AlertResponse> {
  return apiFetch(`/alerts/${alertId}/acknowledge`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}
