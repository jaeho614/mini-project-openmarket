```
market/
├── index.html
├── css/
│    ├── reset.css
│    └── style.css
├── js/
│    ├── app.js # 메인 애플리케이션 진입점
│    ├── router.js # 라우팅 관리
│    ├── api/
│    │    ├── auth.js # 인증 관련 API 호출
│    │    ├── config.js # API 설정 (baseURL, 공통 헤더 등)
│    │    └── product.js # 상품 조회 관련 API 호출
│    ├── components/
│    │    ├── buttonComponent.js # button 컴포넌트
│    │    ├── headerComponent.js # header 컴포넌트
│    │    ├── footerComponent.js # footer 컴포넌트
│    │    ├── formComponent.js # form 컴포넌트
│    │    └── modalComponent.js # modal 컴포넌트
│    ├── pages/
│    │    ├── home.js # 메인 페이지
│    │    ├── login.js # 로그인 페이지
│    │    ├── mypage.js # 마이 페이지
│    │    ├── productDetail.js # 제품 상세 페이지
│    │    └── signup.js # 회원가입 페이지
│    ├── utils/
│    │    ├── auth.js # JWT 토큰 관리, 로그인 상태 확인
│    │    ├── security.js # 유효성 검사
│    │    ├── state.js # state 관리
│    │    ├── validation.js # 입력값 검증
│    │    └── storage.js # localStorage 관리
│    └── constants/
│         └── messages.js # 에러 메시지, 알림 메시지 등
├── assets/
│    ├── images/
│    └── icons/
└── README.md


✅ 구현된 기능
🔐 보안 기능

XSS 방지: 모든 사용자 입력값 sanitize 처리
JWT 토큰 검증: 토큰 유효성 자동 확인
Secure Storage: localStorage 사용
자동 토큰 갱신: 4분마다 access token 자동 갱신

🛣️ 라우팅

History API 기반 SPA 라우팅
뒤로가기/앞으로가기 지원
인증 상태에 따른 페이지 접근 제어

🗂️ 상태관리

중앙집중식 상태 관리 (StateManager)
상태 변경 시 자동 컴포넌트 리렌더링
인증 상태 지속성 관리

🌐 API 연동

RESTful API 통신
자동 토큰 첨부
401 에러 시 토큰 자동 갱신
통합 에러 처리

✅ 입력값 검증

실시간 유효성 검사
아이디 중복 확인
전화번호, 비밀번호 등 형식 검증

📱 반응형 UI

Tailwind CSS를 활용한 모던 디자인
접근성 고려

🔒 보안 고려사항

토큰 저장: sessionStorage 사용으로 탭 종료 시 자동 삭제
XSS 방지: 모든 출력값 sanitize 처리
입력값 검증: 클라이언트와 서버 모두에서 검증
HTTPS 필수: 프로덕션에서는 반드시 HTTPS 사용 권장

📂 코드 구조

보안 유틸리티: XSS 방지, 토큰 검증
상태 관리: 중앙집중식 상태 관리
API 서비스: 통합 API 통신 레이어
라우터: SPA 페이지 라우팅
컴포넌트: 재사용 가능한 UI 컴포넌트
페이지: 각 라우트별 페이지 컴포넌트
```
