/**
 * 범용 공공데이터 API 서비스
 * 여러 API 엔드포인트를 지원하는 확장 가능한 구조
 */

// 환경 설정
const IS_PRODUCTION = import.meta.env.PROD;
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true';
const BASE_PATH = import.meta.env.BASE_URL || '/';
const API_KEY = import.meta.env.VITE_PUBLIC_DATA_API_KEY;

// API 엔드포인트 설정
const API_ENDPOINTS = {
  // 기존 주차장 API
  PARKING: {
    proxy: `${BASE_PATH}api/parking-data.php`.replace(/\/+/g, '/'),
    direct: 'https://api.odcloud.kr/api/15096534/v1/uddi:d91498fc-5229-4d2d-8e72-df412085242f',
    name: '주차장 데이터'
  },
  
  // 향후 추가할 API들 (예시)
  LIBRARY: {
    proxy: `${BASE_PATH}api/library-data.php`.replace(/\/+/g, '/'),
    direct: 'https://api.odcloud.kr/api/LIBRARY_ENDPOINT_ID',
    name: '도서관 데이터'
  },
  
  PARK: {
    proxy: `${BASE_PATH}api/park-data.php`.replace(/\/+/g, '/'),
    direct: 'https://api.odcloud.kr/api/PARK_ENDPOINT_ID',
    name: '공원 데이터'
  },
  
  CULTURE: {
    proxy: `${BASE_PATH}api/culture-data.php`.replace(/\/+/g, '/'),
    direct: 'https://api.odcloud.kr/api/CULTURE_ENDPOINT_ID',
    name: '문화시설 데이터'
  }
};

/**
 * API 키 유효성 검사
 */
const isValidApiKey = () => {
  return API_KEY && API_KEY.trim() !== '' && API_KEY !== 'YOUR_API_KEY_HERE';
};

/**
 * 프록시 API 호출
 * @param {string} apiType - API 타입 (PARKING, LIBRARY, etc.)
 * @param {Object} params - 쿼리 파라미터
 */
const callProxyAPI = async (apiType, params = {}) => {
  const endpoint = API_ENDPOINTS[apiType];
  if (!endpoint) {
    throw new Error(`지원하지 않는 API 타입입니다: ${apiType}`);
  }

  try {
    const queryParams = new URLSearchParams({
      perPage: 10,
      page: 1,
      ...params
    });

    console.log(`🔄 프록시 서버를 통한 ${endpoint.name} API 호출 중...`);
    
    const response = await fetch(`${endpoint.proxy}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'API 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error(`❌ ${endpoint.name} 프록시 API 호출 오류:`, error);
    throw error;
  }
};

/**
 * 직접 API 호출
 * @param {string} apiType - API 타입
 * @param {Object} params - 쿼리 파라미터
 */
const callDirectAPI = async (apiType, params = {}) => {
  const endpoint = API_ENDPOINTS[apiType];
  if (!endpoint) {
    throw new Error(`지원하지 않는 API 타입입니다: ${apiType}`);
  }

  if (!isValidApiKey()) {
    throw new Error('유효한 API 키가 설정되지 않았습니다. .env 파일에 VITE_PUBLIC_DATA_API_KEY를 설정해주세요.');
  }

  try {
    const queryParams = new URLSearchParams({
      serviceKey: API_KEY,
      perPage: 10,
      page: 1,
      returnType: 'json',
      ...params
    });

    console.log(`🔗 실제 ${endpoint.name} API 호출 중...`);

    const response = await fetch(`${endpoint.direct}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.currentCount !== undefined) {
      return data;
    } else if (data.errorCode) {
      throw new Error(`API 오류: ${data.errorMessage} (코드: ${data.errorCode})`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ ${endpoint.name} 직접 API 호출 오류:`, error);
    throw error;
  }
};

/**
 * 범용 API 호출 함수
 * @param {string} apiType - API 타입
 * @param {Object} options - 요청 옵션
 */
export const fetchPublicData = async (apiType, options = {}) => {
  const endpoint = API_ENDPOINTS[apiType];
  if (!endpoint) {
    throw new Error(`지원하지 않는 API 타입입니다: ${apiType}`);
  }

  try {
    // 프록시 사용 또는 프로덕션 환경
    if (USE_PROXY || IS_PRODUCTION) {
      return await callProxyAPI(apiType, options);
    } else {
      // 개발 환경에서 API 키가 유효한 경우 직접 호출
      if (isValidApiKey()) {
        return await callDirectAPI(apiType, options);
      } else {
        // API 키가 없는 경우 모의 데이터 사용
        console.log(`⚠️ API 키가 설정되지 않아 ${endpoint.name} 모의 데이터를 사용합니다.`);
        return await getMockData(apiType);
      }
    }
  } catch (error) {
    console.error(`❌ ${endpoint.name} 가져오기 실패:`, error);
    // 에러 발생 시 모의 데이터 반환
    return await getMockData(apiType);
  }
};

/**
 * 여러 API 동시 호출
 * @param {Array} apiRequests - API 요청 배열 [{type, options}, ...]
 */
export const fetchMultipleData = async (apiRequests) => {
  try {
    console.log('📡 여러 API 동시 호출 시작...');
    
    const promises = apiRequests.map(({ type, options = {} }) => 
      fetchPublicData(type, options)
        .then(data => ({ type, data, success: true }))
        .catch(error => ({ type, error: error.message, success: false }))
    );

    const results = await Promise.all(promises);
    
    console.log('✅ 여러 API 호출 완료');
    return results;
  } catch (error) {
    console.error('❌ 여러 API 호출 중 오류:', error);
    throw error;
  }
};

/**
 * 순차적 API 호출 (하나씩 차례대로)
 * @param {Array} apiRequests - API 요청 배열
 */
export const fetchSequentialData = async (apiRequests) => {
  const results = [];
  
  console.log('🔄 순차적 API 호출 시작...');
  
  for (const { type, options = {} } of apiRequests) {
    try {
      const data = await fetchPublicData(type, options);
      results.push({ type, data, success: true });
    } catch (error) {
      results.push({ type, error: error.message, success: false });
    }
  }
  
  console.log('✅ 순차적 API 호출 완료');
  return results;
};

/**
 * 모의 데이터 생성
 * @param {string} apiType - API 타입
 */
const getMockData = async (apiType) => {
  // 실제 API 호출과 유사한 경험을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (apiType) {
    case 'PARKING':
      return getMockParkingData();
    case 'LIBRARY':
      return getMockLibraryData();
    case 'PARK':
      return getMockParkData();
    case 'CULTURE':
      return getMockCultureData();
    default:
      throw new Error(`모의 데이터가 준비되지 않은 API 타입입니다: ${apiType}`);
  }
};

/**
 * 주차장 모의 데이터
 */
const getMockParkingData = () => ({
  page: 1,
  perPage: 10,
  totalCount: 3,
  currentCount: 3,
  matchCount: 3,
  data: [
    {
      순번: 1,
      개방호수: 20,
      주차장명: '대구북구청 공용주차장(Demo)',
      지번주소: '대구광역시 북구 칠성동2가 302-155',
      면수: 50,
      개방시간: '09:00~18:00',
      경도: '128.5855',
      위도: '35.8842'
    },
    {
      순번: 2,
      개방호수: 15,
      주차장명: '칠성시장 공영주차장(Demo)',
      지번주소: '대구광역시 북구 칠성동2가 151-8',
      면수: 30,
      개방시간: '24시간',
      경도: '128.5901',
      위도: '35.8798'
    },
    {
      순번: 3,
      개방호수: 10,
      주차장명: '북구문화회관 주차장(Demo)',
      지번주소: '대구광역시 북구 산격동 1295',
      면수: 40,
      개방시간: '09:00~22:00',
      경도: '128.5712',
      위도: '35.8956'
    }
  ]
});

/**
 * 도서관 모의 데이터
 */
const getMockLibraryData = () => ({
  page: 1,
  perPage: 10,
  totalCount: 2,
  currentCount: 2,
  matchCount: 2,
  data: [
    {
      순번: 1,
      도서관명: '대구북구립도서관(Demo)',
      주소: '대구광역시 북구 칠성동2가 123-45',
      전화번호: '053-665-1234',
      운영시간: '09:00~18:00',
      휴관일: '매월 둘째, 넷째 월요일',
      경도: '128.5823',
      위도: '35.8867'
    },
    {
      순번: 2,
      도서관명: '칠성도서관(Demo)',
      주소: '대구광역시 북구 칠성동1가 789-12',
      전화번호: '053-665-5678',
      운영시간: '09:00~22:00',
      휴관일: '매월 첫째, 셋째 월요일',
      경도: '128.5889',
      위도: '35.8745'
    }
  ]
});

/**
 * 공원 모의 데이터
 */
const getMockParkData = () => ({
  page: 1,
  perPage: 10,
  totalCount: 2,
  currentCount: 2,
  matchCount: 2,
  data: [
    {
      순번: 1,
      공원명: '침산공원(Demo)',
      주소: '대구광역시 북구 침산동 산 180-1',
      면적: '145,000㎡',
      시설: '산책로, 체육시설, 놀이시설',
      개방시간: '상시개방',
      경도: '128.5478',
      위도: '35.8723'
    },
    {
      순번: 2,
      공원명: '칠성공원(Demo)',
      주소: '대구광역시 북구 칠성동2가 산 45-3',
      면적: '67,000㎡',
      시설: '산책로, 운동기구, 벤치',
      개방시간: '상시개방',
      경도: '128.5834',
      위도: '35.8812'
    }
  ]
});

/**
 * 문화시설 모의 데이터
 */
const getMockCultureData = () => ({
  page: 1,
  perPage: 10,
  totalCount: 2,
  currentCount: 2,
  matchCount: 2,
  data: [
    {
      순번: 1,
      시설명: '북구문화회관(Demo)',
      주소: '대구광역시 북구 산격동 1295',
      전화번호: '053-665-9876',
      운영시간: '09:00~22:00',
      시설규모: '대공연장, 소공연장, 전시실',
      경도: '128.5712',
      위도: '35.8956'
    },
    {
      순번: 2,
      시설명: '칠성문화센터(Demo)',
      주소: '대구광역시 북구 칠성동1가 456-78',
      전화번호: '053-665-1357',
      운영시간: '09:00~18:00',
      시설규모: '전시실, 체험실, 회의실',
      경도: '128.5867',
      위도: '35.8723'
    }
  ]
});

// 지원하는 API 타입 목록 내보내기
export const SUPPORTED_APIS = Object.keys(API_ENDPOINTS);
