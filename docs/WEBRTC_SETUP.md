# WebRTC 스트리밍 설정 가이드

## 개요

프론트엔드에서 MediaMTX WebRTC 서버로부터 실시간 카메라 스트리밍을 받아 표시하는 기능입니다.

## 최근 수정 사항 (2026-05-10)

### 중복 WebRTC 연결 문제 해결

**문제**: 각 카메라에 대해 중복된 WebRTC 연결이 생성되는 현상
- `CameraGrid` 컴포넌트가 모바일/데스크톱 버전을 모두 렌더링하고 CSS로 숨기는 방식으로 인해 모든 카메라가 2번씩 마운트됨
- 모든 카메라가 `streamPath="camera1"`로 하드코딩되어 동일한 스트림에 다중 연결 발생

**해결**:
1. **조건부 렌더링**: `useMediaQuery` 훅 추가하여 모바일 또는 데스크톱 컴포넌트만 렌더링
2. **동적 카메라 ID**: 하드코딩된 `"camera1"` 대신 실제 `camera.id` 사용

**변경된 파일**:
- `src/shared/hooks/useMediaQuery.ts` (신규): 반응형 미디어 쿼리 훅
- `src/features/monitoring/components/CameraGrid.tsx`: CSS 숨김 대신 조건부 렌더링
- `src/features/monitoring/components/CameraFeedCard.tsx`: `streamPath={camera.id}` 사용
- `src/features/monitoring/components/event-detail/EventCCTVPlayer.tsx`: `cameraId` prop 추가
- `src/features/monitoring/pages/EventDetailPage.tsx`: `cameraId` 전달
- `src/features/monitoring/pages/AlertDetailPage.tsx`: `cameraId` 전달

## 구성 요소

### 1. WebRTC 비디오 플레이어 컴포넌트

**위치**: `src/shared/components/WebRTCVideoPlayer.tsx`

**기능**:
- MediaMTX WebRTC 서버에 연결하여 실시간 스트림 수신
- 자동 재연결 및 에러 핸들링
- 로딩 상태 및 에러 메시지 표시

**주요 Props**:
```typescript
interface WebRTCVideoPlayerProps {
  streamPath: string;        // 스트림 경로 (예: "camera1")
  className?: string;        // 추가 CSS 클래스
  muted?: boolean;           // 음소거 여부 (기본값: true)
  onError?: (error: Error) => void;      // 에러 콜백
  onStreamReady?: () => void;            // 스트림 준비 완료 콜백
}
```

**사용 예시**:
```tsx
<WebRTCVideoPlayer 
  streamPath="camera1" 
  className="w-full h-full"
  onError={(err) => console.error('Stream error:', err)}
  onStreamReady={() => console.log('Stream ready')}
/>
```

### 2. 환경 변수 설정

`.env` 파일에 MediaMTX 서버 URL 추가:

```env
VITE_MEDIAMTX_BASE_URL=http://43.202.227.251:8889
```

**환경별 설정**:
- 개발 환경: `http://43.202.227.251:8889` (외부 서버)
- 프로덕션 환경: 실제 배포 서버의 공용 IP와 포트 8889

### 3. 통합된 컴포넌트

#### CameraFeedCard (모니터링 대시보드)

**위치**: `src/features/monitoring/components/CameraFeedCard.tsx`

카메라가 온라인 상태일 때 자동으로 WebRTC 스트리밍 표시:

```tsx
{camera.isOnline ? (
  <WebRTCVideoPlayer streamPath="camera1" className="absolute inset-0" />
) : (
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f172b] to-[#020618]" />
)}
```

#### EventCCTVPlayer (이벤트 상세 페이지)

**위치**: `src/features/monitoring/components/event-detail/EventCCTVPlayer.tsx`

이벤트 상세 페이지에서 해당 이벤트 발생 시점의 카메라 스트림 표시:

```tsx
<WebRTCVideoPlayer streamPath="camera1" className="absolute inset-0" />
```

## 작동 방식

### WebRTC 연결 프로세스

1. **초기화**: `WebRTCVideoPlayer` 컴포넌트가 마운트될 때 `MediaMTXWebRTCReader` 인스턴스 생성
2. **연결**: `reader.start(streamUrl)` 호출로 MediaMTX 서버와 WebRTC 연결 시작
3. **스트림 수신**: WebRTC 연결 성공 시 MediaStream 객체를 `<video>` 엘리먼트에 바인딩
4. **자동 정리**: 컴포넌트 언마운트 시 `reader.stop()` 호출로 연결 해제

### 에러 핸들링

- **연결 실패**: "스트림 연결 실패" 메시지와 에러 상세 정보 표시
- **로딩 상태**: 연결 중일 때 스피너와 "스트림 연결 중..." 메시지 표시
- **자동 복구**: 컴포넌트가 재마운트되거나 `streamPath` prop이 변경되면 자동으로 재연결 시도

## MediaMTX 서버 설정

**백엔드 설정 파일**: `capstone/mediamtx.yml`

**주요 WebRTC 설정**:
```yaml
webrtcAddress: :8889
webrtcAllowOrigins: ['*']
webrtcAdditionalHosts:
  - 43.202.227.251    # 공용 IP
  - 172.31.55.63      # 프라이빗 IP
webrtcICEServers2:
  - url: stun:stun.l.google.com:19302
webrtcHandshakeTimeout: 30s
```

## 테스트 방법

### 1. 브라우저에서 직접 확인

MediaMTX 내장 플레이어로 스트림 동작 확인:
```
http://43.202.227.251:8889/camera1/
```

### 2. 프론트엔드 애플리케이션에서 확인

```bash
cd /home/imsiyoun/project/xross-frontend
npm run dev
```

모니터링 페이지에서 카메라 피드 카드 확인:
- 카메라가 온라인 상태일 때 실시간 스트림이 자동으로 표시됨
- 오프라인 상태일 때 "OFFLINE" 메시지 표시

### 3. 개발자 도구로 디버깅

브라우저 콘솔에서 WebRTC 연결 상태 확인:
```javascript
// onError 콜백으로 에러 캐치
// onStreamReady 콜백으로 연결 성공 확인
```

## 트러블슈팅

### 연결 실패 (Connection Failed)

**원인**:
- MediaMTX 서버가 실행 중이지 않음
- 네트워크 방화벽/보안 그룹이 포트 8889 차단
- 카메라가 MediaMTX에 스트림을 전송하지 않음

**해결 방법**:
1. MediaMTX 서버 상태 확인:
   ```bash
   docker ps | grep mediamtx
   ```

2. 카메라 스트림 확인:
   ```bash
   docker logs mediamtx | grep camera1
   ```

3. 포트 접근 확인:
   ```bash
   curl http://43.202.227.251:8889/camera1/whep
   ```

### CORS 에러

**원인**: MediaMTX 서버의 CORS 설정 문제

**해결 방법**:
`mediamtx.yml`에서 `webrtcAllowOrigins` 확인:
```yaml
webrtcAllowOrigins: ['*']  # 모든 origin 허용
```

### ICE 연결 실패

**원인**: NAT traversal 실패, STUN 서버 문제

**해결 방법**:
1. `webrtcAdditionalHosts`에 공용/프라이빗 IP 모두 추가되었는지 확인
2. STUN 서버 설정 확인:
   ```yaml
   webrtcICEServers2:
     - url: stun:stun.l.google.com:19302
   ```

### 비디오가 표시되지 않음

**원인**: 
- 스트림 경로(`streamPath`)가 잘못됨
- 카메라가 RTSP 스트림을 MediaMTX로 전송하지 않음

**해결 방법**:
1. MediaMTX 로그에서 카메라 연결 확인:
   ```bash
   docker logs mediamtx --tail 50
   ```

2. 올바른 스트림 경로 사용:
   ```tsx
   <WebRTCVideoPlayer streamPath="camera1" />  // ✅ 올바름
   <WebRTCVideoPlayer streamPath="/camera1" /> // ❌ 슬래시 불필요
   ```

## 패키지 의존성

**설치된 패키지**:
```json
{
  "dependencies": {
    "mediamtx-webrtc-react": "^1.x.x"
  }
}
```

## 추가 리소스

- [MediaMTX GitHub](https://github.com/bluenviron/mediamtx)
- [WebRTC API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WHEP Protocol Spec](https://www.ietf.org/archive/id/draft-murillo-whep-00.html)

## 관련 문서

- [FCM 푸시 알림 설정](./FCM_SETUP.md)
- [백엔드 Firebase 설정](../../capstone/docs/FIREBASE_SETUP.md)
