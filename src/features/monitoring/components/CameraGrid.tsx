import { useState } from "react";
import CameraFeedCard from "@/features/monitoring/components/CameraFeedCard";
import type { CameraFeed } from "@/features/monitoring/types/monitoring.types";

const PAGE_SIZE = 4;

interface CameraGridProps {
  cameras: CameraFeed[];
}

export default function CameraGrid({ cameras }: CameraGridProps) {
  const count = cameras.length;

  // 카메라 1개: 전체 너비 단일 뷰
  if (count === 1) {
    return (
      <div className="h-full p-4">
        <CameraFeedCard camera={cameras[0]} className="h-full" />
      </div>
    );
  }

  // 카메라 2개: 좌우 분할
  if (count === 2) {
    return (
      <div className="grid h-full grid-cols-2 gap-4 p-4">
        {cameras.map((cam) => (
          <CameraFeedCard key={cam.id} camera={cam} className="h-full" />
        ))}
      </div>
    );
  }

  // 카메라 3개: 좌측 1개(전체 높이) + 우측 2개 세로 분할
  if (count === 3) {
    return (
      <div className="grid h-full grid-cols-2 gap-4 p-4">
        <CameraFeedCard camera={cameras[0]} className="h-full" />
        <div className="grid grid-rows-2 gap-4">
          <CameraFeedCard camera={cameras[1]} />
          <CameraFeedCard camera={cameras[2]} />
        </div>
      </div>
    );
  }

  // 카메라 4개: 2×2 고정 그리드
  if (count === 4) {
    return (
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-4 p-4">
        {cameras.map((cam) => (
          <CameraFeedCard key={cam.id} camera={cam} />
        ))}
      </div>
    );
  }

  // 카메라 5개 이상: 2×2 그리드 + 페이지네이션
  return <PaginatedGrid cameras={cameras} />;
}

function PaginatedGrid({ cameras }: { cameras: CameraFeed[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(cameras.length / PAGE_SIZE);
  const paged = cameras.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="flex h-full flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-4 p-4">
        {paged.map((cam) => (
          <CameraFeedCard key={cam.id} camera={cam} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex shrink-0 items-center justify-center gap-3 pb-3">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-monitor-border text-monitor-text-muted transition-colors hover:border-monitor-border-strong hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="이전 페이지"
        >
          ‹
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={
                i === page
                  ? "h-1.5 w-4 rounded-full bg-monitor-accent-blue transition-all"
                  : "h-1.5 w-1.5 rounded-full bg-monitor-border-strong transition-all hover:bg-monitor-text-muted"
              }
              aria-label={`${i + 1}페이지`}
            />
          ))}
        </div>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages - 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-monitor-border text-monitor-text-muted transition-colors hover:border-monitor-border-strong hover:text-monitor-text disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="다음 페이지"
        >
          ›
        </button>
      </div>
    </div>
  );
}
