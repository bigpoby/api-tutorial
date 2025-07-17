<?php
/**
 * 공원 데이터 API 프록시 서버 (PHP)
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
 * 공원 모의 데이터 생성
 */
function getMockData() {
    return [
        'page' => 1,
        'perPage' => 10,
        'totalCount' => 4,
        'currentCount' => 4,
        'matchCount' => 4,
        'data' => [
            [
                '순번' => 1,
                '공원명' => '침산공원(Demo)',
                '주소' => '대구광역시 북구 침산동 산 180-1',
                '면적' => '145,000㎡',
                '시설' => '산책로, 체육시설, 놀이시설',
                '개방시간' => '상시개방',
                '경도' => '128.5478',
                '위도' => '35.8723',
                '주차장' => '있음(50대)',
                '화장실' => '있음',
                '비고' => '야간 조명시설 완비'
            ],
            [
                '순번' => 2,
                '공원명' => '칠성공원(Demo)',
                '주소' => '대구광역시 북구 칠성동2가 산 45-3',
                '면적' => '67,000㎡',
                '시설' => '산책로, 운동기구, 벤치',
                '개방시간' => '상시개방',
                '경도' => '128.5834',
                '위도' => '35.8812',
                '주차장' => '있음(30대)',
                '화장실' => '있음',
                '비고' => '어린이 놀이터 있음'
            ],
            [
                '순번' => 3,
                '공원명' => '산격공원(Demo)',
                '주소' => '대구광역시 북구 산격동 1234-5',
                '면적' => '89,000㎡',
                '시설' => '산책로, 농구장, 테니스장',
                '개방시간' => '상시개방',
                '경도' => '128.5712',
                '위도' => '35.8945',
                '주차장' => '있음(40대)',
                '화장실' => '있음',
                '비고' => '스포츠 시설 다양'
            ],
            [
                '순번' => 4,
                '공원명' => '대천공원(Demo)',
                '주소' => '대구광역시 북구 대천동 678-90',
                '면적' => '23,000㎡',
                '시설' => '산책로, 벤치, 꽃밭',
                '개방시간' => '상시개방',
                '경도' => '128.5623',
                '위도' => '35.8756',
                '주차장' => '있음(20대)',
                '화장실' => '있음',
                '비고' => '계절별 꽃 축제 개최'
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
