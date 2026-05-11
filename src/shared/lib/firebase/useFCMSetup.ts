import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { requestFCMToken, getStoredFCMToken, setupForegroundNotifications } from "./fcm";
import { updateProfileApi } from "@/features/auth/api/auth.api";

export function useFCMSetup() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    let unsubscribe: () => void;

    const initializeFCM = async () => {
      try {
        unsubscribe = await setupForegroundNotifications();

        const newToken = await requestFCMToken();
        if (!newToken) return;

        const storedToken = getStoredFCMToken();

        if (newToken !== storedToken) {
          await updateProfileApi({ fcmToken: newToken });
          console.log("FCM token registered to server");
        }
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
      }
    };

    initializeFCM();

    return () => unsubscribe?.();
  }, [accessToken]);
}
