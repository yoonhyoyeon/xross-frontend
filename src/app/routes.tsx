import { Navigate, type RouteObject } from "react-router";
import AuthLayout from "@/shared/layouts/AuthLayout";
import RootLayout from "@/shared/layouts/RootLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import MonitoringPage from "@/features/monitoring/pages/MonitoringPage";
import EventDetailPage from "@/features/monitoring/pages/EventDetailPage";
import PosPage from "@/features/pos/pages/PosPage";
import SettingPage from "@/features/setting/pages/SettingPage";

export const routes: RouteObject[] = [
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  {
    // path 없는 레이아웃 라우트: 사이드바·헤더가 필요한 모든 페이지 공유
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/monitoring" replace /> },
      { path: "monitoring", element: <MonitoringPage /> },
      { path: "monitoring/events/:id", element: <EventDetailPage /> },
      { path: "pos", element: <PosPage /> },
      { path: "settings", element: <SettingPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />, // TODO: 추후 인증 가드로 교체
  },
];
