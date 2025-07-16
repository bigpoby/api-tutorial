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

## 프로젝트 설정 과정

### 1. React Vite 프로젝트 생성
```bash
# Vite를 사용하여 React 프로젝트 생성
npx create-vite@latest . --template react

# 의존성 설치
npm install
```

### 2. 프로젝트 구조 및 설정 파일

프로젝트 생성 후 다음 파일들이 자동으로 생성됩니다:
- `package.json` - 프로젝트 의존성 및 스크립트
- `vite.config.js` - Vite 빌드 도구 설정
- `eslint.config.js` - ESLint 코드 품질 도구 설정
- `index.html` - 메인 HTML 템플릿
- `src/main.jsx` - 애플리케이션 엔트리 포인트
- `src/App.jsx` - 메인 React 컴포넌트

### 3. 개발 환경 설정

#### VS Code 태스크 설정
- `.vscode/tasks.json` 파일을 통해 개발 서버 실행 태스크 설정
- 백그라운드에서 `npm run dev` 명령어 실행

### 4. Git 버전 관리 설정

```bash
# Git 저장소 초기화
git init

# 모든 파일을 스테이징 영역에 추가
git add .

# 첫 번째 커밋 생성
git commit -m "Initial commit: React Vite JavaScript project setup"

# 현재 상태 확인
git status
```

### 5. 개발 서버 실행

```bash
# 개발 서버 시작 (http://localhost:5173)
npm run dev

# 또는 VS Code의 태스크를 통해 백그라운드 실행 가
```