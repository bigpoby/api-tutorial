// 공공데이터 API 서비스 (OData Cloud API)
// Base URL: https://api.odcloud.kr/api
// 데이터셋: 대구광역시 북구 공유개방 주차장 현황
// Swagger 문서: https://infuser.odcloud.kr/oas/docs?namespace=15096534/v1
const PUBLIC_DATA_BASE_URL = 'https://api.odcloud.kr/api';

// 환경변수에서 API 키를 가져오기
const API_KEY = import.meta.env.VITE_PUBLIC_DATA_API_KEY;

/**
 * API 키 유효성 검사
 * @returns {boolean} API 키가 유효한지 여부
 */
const isValidApiKey = () => {
  return API_KEY && API_KEY.trim() !== '' && API_KEY !== 'YOUR_API_KEY_HERE';
};

/**
 * 공공데이터 API 호출 기본 함수
 * @param {string} endpoint - API 엔드포인트 (예: '/15096534/v1/uddi:4b6e43bf-2bbc-4d7c-85b9-a18f0e8b72f7')
 * @param {Object} params - 쿼리 파라미터
 * @returns {Promise} API 응답 데이터
 */
const callPublicDataAPI = async (endpoint, params = {}) => {
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

    const response = await fetch(`${PUBLIC_DATA_BASE_URL}${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // OData Cloud API 응답 구조 검증
    if (data.currentCount !== undefined) {
      // 성공적인 응답
      return data;
    } else if (data.errorCode) {
      // 에러 응답
      throw new Error(`API 오류: ${data.errorMessage} (코드: ${data.errorCode})`);
    }
    
    return data;
  } catch (error) {
    console.error('공공데이터 API 호출 오류:', error);
    throw error;
  }
};

/**
 * 샘플 공공데이터 (모의 데이터) - 실제 API 키가 없을 때 사용
 * 대구광역시 북구 공유개방 주차장 현황 데이터 구조에 맞게 구성
 */
const getMockPublicData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        page: 1,
        perPage: 10,
        totalCount: 5,
        currentCount: 5,
        matchCount: 5,
        data: [
          {
            순번: 1,
            개방호수: 20,
            주차장명: '대구북구청 공용주차장',
            지번주소: '대구광역시 북구 칠성동2가 302-155',
            면수: 50,
            개방시간: '09:00~18:00',
            약정시작일: '2024-01-01',
            약정종료일: '2024-12-31',
            경도: '128.5855',
            위도: '35.8842',
            높이제한시설: '2.1m',
            비고: '공휴일 휴무'
          },
          {
            순번: 2,
            개방호수: 15,
            주차장명: '칠성시장 공영주차장',
            지번주소: '대구광역시 북구 칠성동2가 151-8',
            면수: 30,
            개방시간: '24시간',
            약정시작일: '2024-01-01',
            약정종료일: '2024-12-31',
            경도: '128.5901',
            위도: '35.8798',
            높이제한시설: '없음',
            비고: '연중무휴'
          },
          {
            순번: 3,
            개방호수: 10,
            주차장명: '북구문화회관 주차장',
            지번주소: '대구광역시 북구 산격동 1295',
            면수: 40,
            개방시간: '09:00~22:00',
            약정시작일: '2024-01-01',
            약정종료일: '2024-12-31',
            경도: '128.5712',
            위도: '35.8956',
            높이제한시설: '2.3m',
            비고: '문화행사 시 제한'
          },
          {
            순번: 4,
            개방호수: 25,
            주차장명: '대구교육대학교 개방주차장',
            지번주소: '대구광역시 북구 태전동 219',
            면수: 100,
            개방시간: '18:00~08:00',
            약정시작일: '2024-01-01',
            약정종료일: '2024-12-31',
            경도: '128.5634',
            위도: '35.9067',
            높이제한시설: '2.0m',
            비고: '야간 개방'
          },
          {
            순번: 5,
            개방호수: 12,
            주차장명: '침산공원 주차장',
            지번주소: '대구광역시 북구 침산동 산 180-1',
            면수: 35,
            개방시간: '06:00~22:00',
            약정시작일: '2024-01-01',
            약정종료일: '2024-12-31',
            경도: '128.5478',
            위도: '35.8723',
            높이제한시설: '없음',
            비고: '공원 이용시간 연동'
          }
        ]
      });
    }, 1000); // 1초 지연으로 실제 API 호출과 유사한 경험
  });
};

/**
 * 공유개방 주차장 목록 가져오기
 * @param {Object} options - 검색 옵션
 * @returns {Promise} 주차장 목록 데이터
 */
export const getPublicFacilities = async (options = {}) => {
  try {
    // 실제 API 키가 유효한 경우 실제 API 호출
    if (isValidApiKey()) {
      console.log('실제 공공데이터 API 호출 중...');
      // 대구광역시 북구 공유개방 주차장 현황 API 엔드포인트
      return await callPublicDataAPI('/15096534/v1/uddi:d91498fc-5229-4d2d-8e72-df412085242f', options);
    } else {
      // API 키가 없거나 유효하지 않은 경우 모의 데이터 사용
      console.log('API 키가 설정되지 않아 모의 데이터를 사용합니다.');
      console.log('실제 데이터를 사용하려면 .env 파일에 VITE_PUBLIC_DATA_API_KEY를 설정해주세요.');
      return await getMockPublicData();
    }
  } catch (error) {
    console.error('주차장 데이터 가져오기 실패:', error);
    console.log('오류로 인해 모의 데이터를 사용합니다.');
    // 에러 발생 시 모의 데이터 반환
    return await getMockPublicData();
  }
};
