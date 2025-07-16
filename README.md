# API Tutorial - React + Vite

이 프로젝트는 React와 Vite를 사용하여 빠르고 효율적인 웹 애플리케이션을 구축하는 튜토리얼입니다.

## 기술 스택

- **React 19.1.0** - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- **Vite** - 빠른 개발 서버와 번들링을 위한 빌드 도구
- **ESLint** - 코드 품질과 일관성을 위한 린터

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview
```

## 프로젝트 구조

```
api-tutorial/
├── public/           # 정적 파일
├── src/             # 소스 코드
│   ├── components/  # React 컴포넌트
│   ├── App.jsx      # 메인 앱 컴포넌트
│   └── main.jsx     # 애플리케이션 엔트리 포인트
├── index.html       # HTML 템플릿
└── vite.config.js   # Vite 설정
```

## 개발 가이드

- Hot Module Replacement (HMR)로 빠른 개발 경험
- ESLint 규칙을 통한 코드 품질 관리
- 모던 JavaScript (ES6+) 기능 활용
