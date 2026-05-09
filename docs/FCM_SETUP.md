# Firebase Cloud Messaging (FCM) 설정 가이드

## 개요
이 문서는 프론트엔드에서 Firebase Cloud Messaging (FCM)을 설정하여 푸시알림을 수신하는 방법을 안내합니다.

## 사전 준비
1. Firebase 프로젝트 생성 (백엔드와 동일한 프로젝트 사용)
2. Firebase Console에서 Web App 등록 필요

## 1. Firebase Console 설정

### 1.1 Firebase 프로젝트 접속
- https://console.firebase.google.com/ 접속
- 백엔드에서 사용 중인 프로젝트 선택

### 1.2 Web App 추가 (처음인 경우)
1. 프로젝트 설정 (⚙️ 아이콘) 클릭
2. "내 앱" 섹션에서 웹 아이콘 (`</>`) 클릭
3. 앱 닉네임 입력 (예: "Xross Web")
4. "Firebase Hosting 설정" 체크박스는 선택하지 않음
5. "앱 등록" 클릭
6. Firebase SDK 구성 정보 확인 (다음 단계에서 사용)

### 1.3 Firebase SDK 구성 정보 확인
프로젝트 설정 > 일반 탭에서 다음 정보를 확인:
- **API Key**: `AIza...`로 시작하는 값
- **Auth Domain**: `[프로젝트ID].firebaseapp.com`
- **Project ID**: 프로젝트 ID
- **Storage Bucket**: `[프로젝트ID].appspot.com`
- **Messaging Sender ID**: 숫자로 된 ID
- **App ID**: `1:...` 형태의 ID

### 1.4 VAPID Key 생성
1. 프로젝트 설정 > 클라우드 메시징 탭 이동
2. "웹 푸시 인증서" 섹션에서 "키 생성" 클릭 (또는 기존 키 사용)
3. 생성된 키 페어 저장 (다음 단계에서 사용)

## 2. 환경 변수 설정

### 2.1 `.env` 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용 입력:

```bash
# API Base URL (백엔드 서버 주소)
VITE_API_BASE_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

### 2.2 값 채우기
Firebase Console에서 확인한 값으로 각 항목을 채웁니다:
- `VITE_FIREBASE_API_KEY`: Firebase SDK 구성의 `apiKey`
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase SDK 구성의 `authDomain`
- `VITE_FIREBASE_PROJECT_ID`: Firebase SDK 구성의 `projectId`
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase SDK 구성의 `storageBucket`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase SDK 구성의 `messagingSenderId`
- `VITE_FIREBASE_APP_ID`: Firebase SDK 구성의 `appId`
- `VITE_FIREBASE_VAPID_KEY`: 웹 푸시 인증서의 키 페어

## 3. Service Worker 설정

### 3.1 Service Worker 파일 수정
`public/firebase-messaging-sw.js` 파일의 Firebase 설정을 업데이트합니다:

```javascript
firebase.initializeApp({
  apiKey: "your-firebase-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
});
```

**주의**: Service Worker는 환경변수를 직접 참조할 수 없으므로, `.env` 파일과 동일한 값을 하드코딩해야 합니다.

## 4. 애플리케이션 실행

### 4.1 개발 서버 실행
```bash
npm run dev
```

### 4.2 브라우저 접속
- http://localhost:3000 (또는 Vite가 제공하는 주소)

### 4.3 알림 권한 허용
- 브라우저에서 알림 권한 요청이 표시되면 "허용" 클릭
- FCM 토큰이 자동으로 생성되고 백엔드에 등록됩니다

## 5. 동작 확인

### 5.1 콘솔 로그 확인
브라우저 개발자 도구 (F12) > Console 탭에서 다음 로그 확인:
- `Service Worker registered: ...`
- `FCM token obtained: ...`
- `FCM token registered to server`

### 5.2 푸시알림 테스트
1. 백엔드에서 알림 생성 (예: `POST /alerts` API 호출)
2. 브라우저에 알림이 표시되는지 확인
   - **포그라운드**: 브라우저 탭이 활성화된 상태에서 알림 수신
   - **백그라운드**: 브라우저 탭이 비활성화 또는 최소화된 상태에서 알림 수신

## 6. 문제 해결

### 6.1 Service Worker 등록 실패
**증상**: `Service Worker registration failed` 에러
**해결**:
- HTTPS 환경에서만 Service Worker 동작 (localhost는 예외)
- 브라우저가 Service Worker를 지원하는지 확인

### 6.2 알림 권한 거부됨
**증상**: `Notification permission denied` 경고
**해결**:
- 브라우저 설정에서 알림 권한을 다시 허용
- Chrome: 주소창 왼쪽의 자물쇠 아이콘 > 알림 > 허용

### 6.3 FCM 토큰 생성 실패
**증상**: `No FCM token available` 경고
**해결**:
- Firebase 설정이 올바른지 확인 (`.env` 및 `firebase-messaging-sw.js`)
- VAPID Key가 올바른지 확인
- 브라우저 콘솔에서 상세 에러 확인

### 6.4 백엔드에 토큰 등록 실패
**증상**: `Failed to initialize FCM` 에러
**해결**:
- 로그인 상태 확인 (`accessToken`이 있어야 함)
- 백엔드 `PATCH /auth/me` API가 정상 동작하는지 확인
- 네트워크 탭에서 요청/응답 확인

### 6.5 푸시알림이 표시되지 않음
**증상**: FCM 토큰은 등록되었지만 알림이 오지 않음
**해결**:
- 백엔드 로그에서 FCM 메시지 전송 로그 확인
- Firebase Console > Cloud Messaging에서 전송 통계 확인
- 브라우저가 알림을 차단하지 않았는지 확인 (시스템 설정 포함)

## 7. 토큰 갱신 (Token Refresh)

### 7.1 자동 갱신
현재 구현에서는 다음 시점에 토큰이 자동으로 갱신됩니다:
- 로그인할 때
- 브라우저를 새로고침할 때 (accessToken이 있는 경우)
- 새로운 FCM 토큰이 생성되었을 때

### 7.2 수동 갱신 (선택사항)
Firebase SDK의 `onTokenRefresh` 이벤트를 추가로 구현하려면 `src/shared/lib/firebase/fcm.ts`에 다음 로직 추가:

```typescript
import { onMessage, getToken } from "firebase/messaging";

export async function setupTokenRefresh() {
  const messaging = await getMessagingInstance();
  if (!messaging) return;

  // 토큰 갱신 이벤트 리스너
  onMessage(messaging, async () => {
    const newToken = await requestFCMToken();
    if (newToken) {
      await updateProfileApi({ fcmToken: newToken });
      console.log("FCM token refreshed and updated");
    }
  });
}
```

## 8. 프로덕션 배포 시 주의사항

### 8.1 HTTPS 필수
- Service Worker는 HTTPS 환경에서만 동작합니다 (localhost 제외)
- 프로덕션 배포 시 반드시 HTTPS 인증서 적용 필요

### 8.2 환경변수 관리
- `.env` 파일은 `.gitignore`에 추가하여 Git에 커밋하지 않음
- CI/CD 환경에서는 환경변수를 별도로 설정

### 8.3 Service Worker 캐싱
- `firebase-messaging-sw.js` 파일이 변경되면 브라우저 캐시를 지워야 함
- 배포 시 Service Worker의 버전 관리 고려

## 9. 참고 자료
- [Firebase Cloud Messaging Web Guide](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
