<?php
/**
 * 공공데이터 API 프록시 서버 (PHP)
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

// 환경 설정 (config.php에서 로드됨)
// define('API_BASE_URL', 'https://api.odcloud.kr/api');
// define('API_KEY', 'YOUR_ACTUAL_API_KEY_HERE'); // 실제 API 키는 config.php에서 설정

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
 * 모의 데이터 생성
 */
function getMockData() {
    return [
        'page' => 1,
        'perPage' => 10,
        'totalCount' => 5,
        'currentCount' => 5,
        'matchCount' => 5,
        'data' => [
            [
                '순번' => 1,
                '개방호수' => 20,
                '주차장명' => '대구북구청 공용주차장(Demo)',
                '지번주소' => '대구광역시 북구 칠성동2가 302-155',
                '면수' => 50,
                '개방시간' => '09:00~18:00',
                '약정시작일' => '2024-01-01',
                '약정종료일' => '2024-12-31',
                '경도' => '128.5855',
                '위도' => '35.8842',
                '높이제한시설' => '2.1m',
                '비고' => '공휴일 휴무'
            ],
            [
                '순번' => 2,
                '개방호수' => 15,
                '주차장명' => '칠성시장 공영주차장(Demo)',
                '지번주소' => '대구광역시 북구 칠성동2가 151-8',
                '면수' => 30,
                '개방시간' => '24시간',
                '약정시작일' => '2024-01-01',
                '약정종료일' => '2024-12-31',
                '경도' => '128.5901',
                '위도' => '35.8798',
                '높이제한시설' => '없음',
                '비고' => '연중무휴'
            ],
            [
                '순번' => 3,
                '개방호수' => 10,
                '주차장명' => '북구문화회관 주차장(Demo)',
                '지번주소' => '대구광역시 북구 산격동 1295',
                '면수' => 40,
                '개방시간' => '09:00~22:00',
                '약정시작일' => '2024-01-01',
                '약정종료일' => '2024-12-31',
                '경도' => '128.5712',
                '위도' => '35.8956',
                '높이제한시설' => '2.3m',
                '비고' => '문화행사 시 제한'
            ],
            [
                '순번' => 4,
                '개방호수' => 25,
                '주차장명' => '대구교육대학교 개방주차장(Demo)',
                '지번주소' => '대구광역시 북구 태전동 219',
                '면수' => 100,
                '개방시간' => '18:00~08:00',
                '약정시작일' => '2024-01-01',
                '약정종료일' => '2024-12-31',
                '경도' => '128.5634',
                '위도' => '35.9067',
                '높이제한시설' => '2.0m',
                '비고' => '야간 개방'
            ],
            [
                '순번' => 5,
                '개방호수' => 12,
                '주차장명' => '침산공원 주차장(Demo)',
                '지번주소' => '대구광역시 북구 침산동 산 180-1',
                '면수' => 35,
                '개방시간' => '06:00~22:00',
                '약정시작일' => '2024-01-01',
                '약정종료일' => '2024-12-31',
                '경도' => '128.5478',
                '위도' => '35.8723',
                '높이제한시설' => '없음',
                '비고' => '공원 이용시간 연동'
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

// 요청 파라미터 처리
$params = [
    'serviceKey' => API_KEY,
    'perPage' => isset($_GET['perPage']) ? intval($_GET['perPage']) : 10,
    'page' => isset($_GET['page']) ? intval($_GET['page']) : 1,
    'returnType' => 'json'
];

// 추가 파라미터 처리
$allowedParams = ['search', 'searchType', 'sort', 'sortOrder'];
foreach ($allowedParams as $param) {
    if (isset($_GET[$param]) && !empty($_GET[$param])) {
        $params[$param] = $_GET[$param];
    }
}

// API 엔드포인트 설정
$endpoint = '/15096534/v1/uddi:d91498fc-5229-4d2d-8e72-df412085242f';
$url = API_BASE_URL . $endpoint . '?' . http_build_query($params);

// cURL 요청 설정
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; PublicDataProxy/1.0)',
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json'
    ]
]);

// API 요청 실행
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// cURL 에러 처리
if ($error) {
    error_log("cURL Error: " . $error);
    $mockData = getMockData();
    $mockData['_notice'] = 'API 요청 중 오류가 발생하여 모의 데이터를 사용합니다.';
    sendResponse($mockData);
}

// HTTP 상태 코드 확인
if ($httpCode !== 200) {
    error_log("HTTP Error: " . $httpCode);
    $mockData = getMockData();
    $mockData['_notice'] = 'API 서버 오류로 인해 모의 데이터를 사용합니다.';
    sendResponse($mockData);
}

// JSON 응답 파싱
$data = json_decode($response, true);

// JSON 파싱 에러 처리
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON Parse Error: " . json_last_error_msg());
    $mockData = getMockData();
    $mockData['_notice'] = 'API 응답 파싱 오류로 인해 모의 데이터를 사용합니다.';
    sendResponse($mockData);
}

// API 에러 응답 처리
if (isset($data['errorCode'])) {
    error_log("API Error: " . $data['errorMessage']);
    $mockData = getMockData();
    $mockData['_notice'] = 'API 오류: ' . $data['errorMessage'];
    sendResponse($mockData);
}

// 성공 응답 반환
sendResponse($data);
?>
