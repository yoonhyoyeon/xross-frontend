import { Outlet } from "react-router";
import Sidebar from "@/shared/ui/Sidebar";

export default function RootLayout() {
  return (
    <div className="bg-surface-page flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
