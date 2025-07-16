# API 키 관리 가이드

## 🔄 환경별 키 관리 방식

### 1. **배포 환경 (권장)**
```bash
# .env 파일
VITE_USE_PROXY=true
VITE_PUBLIC_DATA_API_KEY=IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==  # 있어도 무시됨
```

```php
// config.php 파일
define('API_KEY', 'IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA=='); // 실제 API 키 설정
```

**장점**: 
- ✅ 클라이언트에 API 키 노출 안됨
- ✅ CORS 문제 해결
- ✅ 보안 강화

### 2. **개발 환경 (직접 API 호출)**
```bash
# .env 파일
VITE_USE_PROXY=false
VITE_PUBLIC_DATA_API_KEY=IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==  # 실제 키 필요
```

```php
// config.php 파일
define('API_KEY', 'ANY_VALUE'); // 사용 안됨
```

**장점**: 
- ✅ 빠른 개발 가능
- ✅ 프록시 서버 없이 테스트 가능

**단점**: 
- ❌ 클라이언트에 API 키 노출
- ❌ CORS 문제 발생 가능

### 3. **개발 환경 (프록시 사용)**
```bash
# .env 파일
VITE_USE_PROXY=true
VITE_PUBLIC_DATA_API_KEY=IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==  # 있어도 무시됨
```

```php
// config.php 파일
define('API_KEY', 'IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA=='); // 실제 키 설정
```

**장점**: 
- ✅ 배포 환경과 동일한 구조
- ✅ 보안 강화
- ✅ CORS 문제 해결

## 📝 현재 설정 상태

### .env 파일 (현재)
```bash
VITE_USE_PROXY=true
VITE_PUBLIC_DATA_API_KEY=IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==  # 키 설정됨 (프록시 사용으로 무시)
```

### config.php 파일 (현재)
```php
define('API_KEY', 'IfrYxxiZqH2B8Fc5Vw/3HYY27uwsWkHbWmUmBwn41iGtTfWb5W3Z91OzyetgljCQ65x7eYX4ji6Db5qF6K3EQA==');
```

## 🔄 개발 중 환경 전환 방법

### 프록시 사용 → 직접 API 호출
```bash
# .env 파일에서 변경
VITE_USE_PROXY=false
```
- 개발 서버 재시작 필요
- 브라우저에서 CORS 오류 발생할 수 있음 (브라우저 확장 프로그램 사용)

### 직접 API 호출 → 프록시 사용
```bash
# .env 파일에서 변경
VITE_USE_PROXY=true
```
- 개발 서버 재시작 필요
- PHP 서버 실행 필요 (빌드된 파일에서 테스트)

## 🎯 배포 시 할 일

1. **config.php 확인**: API 키가 올바르게 설정되었는지 확인
2. **빌드 실행**: `npm run build`
3. **파일 업로드**: `dist/` 폴더 전체를 닷홈 호스팅에 업로드
4. **테스트**: API 응답이 정상인지 확인

## 💡 정리

- **환경별 키 사용**: 
  - `VITE_USE_PROXY=true`: `config.php`의 API 키 사용
  - `VITE_USE_PROXY=false`: `.env`의 API 키 사용
- **개발 편의성**: 두 파일 모두 같은 키로 설정하여 환경 전환 용이
- **보안 고려**: 배포 시에는 `VITE_USE_PROXY=true`로 설정하여 클라이언트 노출 방지
- **간편한 테스트**: .env 파일의 VITE_USE_PROXY 값만 변경하면 즉시 환경 전환
