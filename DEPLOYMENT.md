# 배포 가이드 (닷홈 호스팅)

## 🚀 배포 개요

이 프로젝트는 React + Vite 기반으로 개발되었으며, 닷홈 호스팅에 배포하기 위해 다음 기능들이 구현되어 있습니다:

- **Zustand 상태 관리**: 중앙 집중식 상태 관리
- **PHP 프록시 서버**: CORS 문제 해결 및 API 키 보안
- **환경 변수 제어**: 개발/배포 환경별 API 호출 방식 제어
- **폴백 시스템**: API 오류 시 모의 데이터 제공
- **서브디렉토리 배포 지원**: `/reactapi/` 경로에 배포 가능

## 📂 배포 경로 설정

### 루트 도메인 배포 (기본)
```
https://your-domain.dothome.co.kr/
```

### 서브디렉토리 배포 (/reactapi/)
```
https://your-domain.dothome.co.kr/reactapi/
```

**현재 설정**: 서브디렉토리 배포 (`/reactapi/`)로 설정되어 있습니다.

### 배포 경로 변경 방법

#### 1. 루트 도메인으로 배포하려면:
```javascript
// vite.config.js 수정
base: mode === 'production' ? '/' : '/',
```

#### 2. 다른 서브디렉토리로 배포하려면:
```javascript
// vite.config.js 수정
base: mode === 'production' ? '/your-path/' : '/',
```

## 📋 배포 준비 체크리스트

### 1. 환경 변수 설정 확인
```bash
# .env 파일 확인
VITE_USE_PROXY=true  # 배포 환경에서는 반드시 true
VITE_PUBLIC_DATA_API_KEY=실제_API_키  # 개발용 (프록시 사용 시 무시됨)
```

### 2. API 키 설정 확인
```bash
# public/api/config.php 파일 확인
define('API_KEY', '실제_API_키');  # 프록시 서버에서 사용할 실제 키
```

### 3. 프로젝트 빌드
```bash
npm run build
```

## 🔧 상세 배포 단계

### 1단계: 환경 설정 점검

#### .env 파일 설정
```bash
# 공공데이터포털 API 키 설정
VITE_PUBLIC_DATA_API_KEY=IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==

# 프록시 사용여부 - 배포시 반드시 true
VITE_USE_PROXY=true
```

#### config.php 파일 설정
```php
<?php
// 실제 API 키 설정 (보안상 중요!)
define('API_KEY', 'IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==');
define('API_BASE_URL', 'https://api.odcloud.kr/api');
?>
```

### 2단계: 빌드 실행

```bash
npm run build
```

빌드 완료 후 다음 파일들이 `dist/` 폴더에 생성됩니다:
- `index.html` (메인 페이지)
- `assets/` (CSS, JS 번들)
- `vite.svg` (파비콘)
- `api/parking-data.php` (프록시 서버)
- `api/config.php` (API 설정)
- `api/config.php.template` (설정 템플릿)

### 3단계: 파일 업로드

#### 서브디렉토리 배포 (/reactapi/)
닷홈 호스팅의 `public_html/reactapi/` 폴더를 생성하고 다음 파일들을 업로드:

```
public_html/
└── reactapi/
    ├── index.html
    ├── vite.svg
    ├── assets/
    │   ├── index-[hash].css
    │   └── index-[hash].js
    └── api/
        ├── parking-data.php
        ├── config.php
        └── config.php.template
```

#### 루트 도메인 배포 (/)
닷홈 호스팅의 `public_html/` 폴더에 직접 업로드:

```
public_html/
├── index.html
├── vite.svg
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── api/
    ├── parking-data.php
    ├── config.php
    └── config.php.template
```

#### 업로드 방법
1. **FTP 클라이언트 사용**: FileZilla, WinSCP 등
2. **웹 파일 매니저**: 닷홈 제공 웹 파일 관리자
3. **압축 파일 업로드**: dist 폴더를 압축 후 업로드 후 압축 해제

**주의**: 서브디렉토리 배포 시 `reactapi` 폴더를 먼저 생성해야 합니다.

### 4단계: 보안 설정

#### 파일 권한 설정
```bash
# config.php 파일 권한 설정 (소유자만 읽기/쓰기)
chmod 600 public_html/api/config.php
```

#### 추가 보안 조치
1. **config.php 위치 변경** (권장):
   ```php
   // config.php를 public_html 밖으로 이동
   // parking-data.php에서 경로 수정
   require_once __DIR__ . '/../../config.php';
   ```

2. **.htaccess 파일 생성**:
   ```apache
   # public_html/api/.htaccess
   <Files "config.php">
       Order allow,deny
       Deny from all
   </Files>
   ```

### 5단계: 테스트

#### 배포 확인 사항
1. **사이트 접속**: 
   - 서브디렉토리: `https://your-domain.dothome.co.kr/reactapi/`
   - 루트 도메인: `https://your-domain.dothome.co.kr/`
2. **API 호출 확인**: 개발자 도구에서 네트워크 탭 확인
3. **데이터 로드 확인**: 주차장 목록이 정상적으로 표시되는지 확인

#### 테스트 URL
```bash
# 서브디렉토리 배포 시 API 엔드포인트 테스트
https://your-domain.dothome.co.kr/reactapi/api/parking-data.php

# 루트 도메인 배포 시 API 엔드포인트 테스트
https://your-domain.dothome.co.kr/api/parking-data.php

# 예상 응답 (성공 시):
{
  "page": 1,
  "perPage": 10,
  "totalCount": 실제_데이터_수,
  "data": [...]
}

# 예상 응답 (API 키 오류 시):
{
  "page": 1,
  "perPage": 10,
  "totalCount": 5,
  "data": [...],
  "_notice": "API 키가 설정되지 않아 모의 데이터를 사용합니다."
}
```

## 🔍 문제 해결

### 일반적인 문제들

#### 1. API 키 오류
**증상**: 모의 데이터만 표시됨
**해결**: 
- `config.php`에서 API 키 확인
- `YOUR_ACTUAL_API_KEY_HERE`가 실제 키로 교체되었는지 확인

#### 2. 404 오류 (파일을 찾을 수 없음)
**증상**: `parking-data.php`에 접근할 수 없음
**해결**:
- 파일 업로드 확인
- 파일 권한 확인 (644 또는 755)
- 경로 확인

#### 3. CORS 오류
**증상**: 브라우저에서 CORS 오류 발생
**해결**:
- `parking-data.php`의 CORS 헤더 확인
- 도메인별 CORS 설정 조정

#### 4. PHP 실행 오류
**증상**: PHP 코드가 텍스트로 표시됨
**해결**:
- 닷홈 호스팅 PHP 지원 확인
- 파일 확장자 `.php` 확인

### 디버깅 도구

#### 브라우저 개발자 도구
1. **Network 탭**: API 호출 상태 확인
2. **Console 탭**: JavaScript 오류 확인
3. **Application 탭**: 환경 변수 확인

#### 서버 로그
```bash
# 닷홈 호스팅 오류 로그 확인
tail -f /home/계정명/public_html/logs/error.log
```

## 🔄 업데이트 배포

### 코드 변경 시
1. 로컬에서 수정 및 테스트
2. `npm run build` 실행
3. 변경된 파일만 업로드

### API 키 변경 시
1. `config.php`에서 API 키 수정
2. 브라우저 캐시 삭제 후 테스트

## 📊 성능 최적화

### 빌드 최적화
- Vite의 자동 코드 분할 활용
- 불필요한 라이브러리 제거
- 이미지 최적화

### 서버 최적화
- PHP OPcache 활용
- 정적 파일 캐싱
- Gzip 압축 활용

## 🚨 보안 주의사항

1. **API 키 보호**: 절대로 클라이언트 코드에 노출하지 않음
2. **HTTPS 사용**: 가능하면 SSL 인증서 적용
3. **정기적 키 교체**: 보안을 위해 정기적으로 API 키 교체
4. **로그 모니터링**: 비정상적인 API 호출 모니터링

## 💡 추가 팁

### 개발 환경 설정
```bash
# 로컬 테스트 시 프록시 사용
VITE_USE_PROXY=true

# 직접 API 호출 테스트 시
VITE_USE_PROXY=false
```

### 백업 및 복원
- 정기적으로 `config.php` 파일 백업
- 데이터베이스 사용 시 정기 백업
- 소스 코드 Git 관리

---

## 📞 지원 및 문의

- **닷홈 호스팅 지원**: https://dothome.co.kr
- **공공데이터포털**: https://www.data.go.kr
- **프로젝트 이슈**: GitHub Issues 활용
