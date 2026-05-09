import { useEffect } from "react";
import { useRoutes } from "react-router";
import { routes } from "@/app/routes";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  requestFCMToken,
  getStoredFCMToken,
  setupForegroundNotifications,
} from "@/shared/lib/firebase/fcm";
import { updateProfileApi } from "@/features/auth/api/auth.api";

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const initializeFCM = async () => {
      try {
        await setupForegroundNotifications();

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
  }, [accessToken]);

  return useRoutes(routes);
}

export default App;
