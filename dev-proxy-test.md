# 개발 환경에서 프록시 설정 방법

## 🎯 VITE_USE_PROXY 설정에 따른 동작

### 1. VITE_USE_PROXY=false (기본값)
```bash
# .env 파일
VITE_USE_PROXY=false
```
**동작**: 
- 개발 환경에서 프록시 사용 안함
- API 키가 있으면 직접 API 호출
- API 키가 없으면 모의 데이터 사용

**콘솔 로그**:
- 🔗 실제 공공데이터 API 호출 중... (API 키 있음)
- ⚠️ API 키가 설정되지 않아 모의 데이터를 사용합니다. (API 키 없음)

### 2. VITE_USE_PROXY=true
```bash
# .env 파일
VITE_USE_PROXY=true
```
**동작**:
- 개발 환경에서도 프록시 사용 시도
- PHP 파일이 없으면 오류 후 모의 데이터 사용

**콘솔 로그**:
- 🔄 프록시 서버를 통한 공공데이터 API 호출 중...
- 🔄 프록시 서버 오류로 인해 모의 데이터를 사용합니다. (오류 시)

## 🔧 환경별 동작 테이블

| 환경 | VITE_USE_PROXY | API 키 | 동작 | 데이터 소스 |
|------|----------------|--------|------|-------------|
| 개발 | false | 없음 | 모의 데이터 | getMockPublicData() |
| 개발 | false | 있음 | 직접 API | 공공데이터 API |
| 개발 | true | 관계없음 | 프록시 시도 | PHP 프록시 → 모의 데이터 |
| 프로덕션 | 관계없음 | 관계없음 | 프록시 사용 | PHP 프록시 |

## 🚀 테스트 시나리오

### 시나리오 1: 개발 환경에서 직접 API 호출
```bash
# .env 파일
VITE_PUBLIC_DATA_API_KEY=실제_API_키
VITE_USE_PROXY=false
```

### 시나리오 2: 개발 환경에서 프록시 테스트
```bash
# .env 파일
VITE_USE_PROXY=true
```
그 후 PHP 서버 실행:
```bash
cd dist
php -S localhost:8080
```

### 시나리오 3: 모의 데이터 사용 (기본값)
```bash
# .env 파일
VITE_USE_PROXY=false
# VITE_PUBLIC_DATA_API_KEY는 설정하지 않음
```

## 💡 권장 설정

### 개발 중
```bash
VITE_USE_PROXY=false
VITE_PUBLIC_DATA_API_KEY=실제_API_키  # 실제 데이터 필요시만
```

### 프록시 테스트
```bash
VITE_USE_PROXY=true
```

### 데모/프레젠테이션
```bash
VITE_USE_PROXY=false
# API 키 없이 모의 데이터 사용
```
