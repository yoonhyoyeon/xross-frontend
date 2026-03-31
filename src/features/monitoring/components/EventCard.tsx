import { useNavigate } from "react-router";
import { cn } from "@/shared/lib/utils";
import type { DetectionEvent } from "@/features/monitoring/types/monitoring.types";
import EventStatusBadge from "@/features/monitoring/components/EventStatusBadge";
import ShieldAlertIcon from "@/assets/icons/shield-alert.svg?react";
import TriangleAlertIcon from "@/assets/icons/triangle-alert.svg?react";
import EventInfoIcon from "@/assets/icons/event-info.svg?react";
import PersonStandingIcon from "@/assets/icons/person-standing.svg?react";

const SEVERITY_CONFIG: Record<
  DetectionEvent["severity"],
  {
    border: string;
    shadow: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  critical: {
    border: "border-[rgba(251,44,54,0.4)]",
    shadow: "shadow-[0_0_15px_rgba(239,68,68,0.05)]",
    iconBg: "bg-[#fb2c36] shadow-[0_0_10px_rgba(239,68,68,0.4)]",
    iconColor: "text-white",
    titleColor: "text-event-critical",
    Icon: ShieldAlertIcon,
  },
  warning: {
    border: "border-[rgba(254,154,0,0.3)]",
    shadow: "",
    iconBg: "bg-[rgba(254,154,0,0.2)]",
    iconColor: "text-event-warning",
    titleColor: "text-event-warning",
    Icon: TriangleAlertIcon,
  },
  behavior: {
    border: "border-[rgba(254,154,0,0.3)]",
    shadow: "",
    iconBg: "bg-[rgba(254,154,0,0.2)]",
    iconColor: "text-event-warning",
    titleColor: "text-event-warning",
    Icon: PersonStandingIcon,
  },
  info: {
    border: "border-monitor-border",
    shadow: "",
    iconBg: "bg-monitor-border",
    iconColor: "text-monitor-text-muted",
    titleColor: "text-monitor-text-muted",
    Icon: EventInfoIcon,
  },
};

interface EventCardProps {
  event: DetectionEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const { Icon: EventIcon, ...style } = SEVERITY_CONFIG[event.severity];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/monitoring/events/${event.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/monitoring/events/${event.id}`)}
      className={cn(
        "bg-monitor-card-bg relative cursor-pointer rounded-[14px] border p-[14px] transition-opacity hover:opacity-80",
        style.border,
        style.shadow,
      )}
    >
      {/* 헤더: 아이콘 + 제목 + 타임스탬프 */}
      <div className="flex items-start gap-[10px]">
        <div
          className={cn(
            "mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]",
            style.iconBg,
            style.iconColor,
          )}
        >
          <EventIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col gap-[2px]">
          <span
            className={cn(
              "text-[14px] leading-5 font-bold tracking-[-0.15px]",
              style.titleColor,
            )}
          >
            {event.title}
          </span>
          <span className="text-monitor-text-dim font-mono text-[10px] leading-[15px]">
            {event.timestamp} • {event.id}
          </span>
        </div>
      </div>

      {/* 설명 */}
      <p className="text-monitor-text-muted mt-[10px] pl-[38px] text-[12px] leading-[1.625]">
        {event.description}
      </p>

      {/* 태그 */}
      {event.tags && event.tags.length > 0 && (
        <div className="mt-[10px] flex flex-wrap gap-[6px] pl-[38px]">
          {event.tags.map((tag) => (
            <EventStatusBadge
              key={tag.type}
              type={tag.type}
              label={tag.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}
