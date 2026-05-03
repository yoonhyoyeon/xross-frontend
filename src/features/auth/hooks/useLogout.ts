import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearAuth();
    queryClient.clear();
    navigate("/auth/login", { replace: true });
  };
}
