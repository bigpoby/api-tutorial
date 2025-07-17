<?php
/**
 * 문화시설 데이터 API 프록시 서버 (PHP)
 * - CORS 문제 해결
 * - API 키 보안 보호
 * - 닷홈 호스팅 환경 최적화
 */

// CORS 헤더 설정
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// OPTIONS 요청 처리 (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 설정 파일 로드
require_once __DIR__ . '/config.php';

/**
 * API 키 유효성 검사
 */
function isValidApiKey() {
    return API_KEY && trim(API_KEY) !== '' && API_KEY !== 'YOUR_ACTUAL_API_KEY_HERE';
}

/**
 * 에러 응답 반환
 */
function sendError($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'error' => true,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

/**
 * 성공 응답 반환
 */
function sendResponse($data) {
    http_response_code(200);
    echo json_encode($data);
    exit();
}

/**
 * 문화시설 모의 데이터 생성
 */
function getMockData() {
    return [
        'page' => 1,
        'perPage' => 10,
        'totalCount' => 3,
        'currentCount' => 3,
        'matchCount' => 3,
        'data' => [
            [
                '순번' => 1,
                '시설명' => '북구문화회관(Demo)',
                '주소' => '대구광역시 북구 산격동 1295',
                '전화번호' => '053-665-9876',
                '운영시간' => '09:00~22:00',
                '휴관일' => '매월 첫째, 셋째 월요일',
                '시설규모' => '대공연장, 소공연장, 전시실',
                '경도' => '128.5712',
                '위도' => '35.8956',
                '좌석수' => '800',
                '주차장' => '있음(150대)',
                '비고' => '다양한 문화 공연 개최'
            ],
            [
                '순번' => 2,
                '시설명' => '칠성문화센터(Demo)',
                '주소' => '대구광역시 북구 칠성동1가 456-78',
                '전화번호' => '053-665-1357',
                '운영시간' => '09:00~18:00',
                '휴관일' => '매월 둘째, 넷째 일요일',
                '시설규모' => '전시실, 체험실, 회의실',
                '경도' => '128.5867',
                '위도' => '35.8723',
                '좌석수' => '200',
                '주차장' => '있음(50대)',
                '비고' => '지역 문화 교육 프로그램 운영'
            ],
            [
                '순번' => 3,
                '시설명' => '대구북구미술관(Demo)',
                '주소' => '대구광역시 북구 태전동 789-12',
                '전화번호' => '053-665-2468',
                '운영시간' => '10:00~18:00',
                '휴관일' => '매주 월요일',
                '시설규모' => '전시실1, 전시실2, 수장고',
                '경도' => '128.5634',
                '위도' => '35.9034',
                '좌석수' => '100',
                '주차장' => '있음(80대)',
                '비고' => '현대 미술 작품 전시'
            ]
        ]
    ];
}

// GET 요청만 허용
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Only GET method is allowed', 405);
}

// API 키 검증
if (!isValidApiKey()) {
    // API 키가 없으면 모의 데이터 반환
    $mockData = getMockData();
    $mockData['_notice'] = 'API 키가 설정되지 않아 모의 데이터를 사용합니다.';
    sendResponse($mockData);
}

// 실제 API 호출 로직은 여기에 구현
// 현재는 모의 데이터만 반환
$mockData = getMockData();
$mockData['_notice'] = '실제 API 연동 준비 중입니다.';
sendResponse($mockData);
?>
