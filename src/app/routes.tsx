import { type RouteObject } from "react-router";
import LoginPage from "@/features/auth/pages/LoginPage";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <LoginPage />, // TODO: 추후 인증 가드 + 리다이렉트로 교체
  },
];
