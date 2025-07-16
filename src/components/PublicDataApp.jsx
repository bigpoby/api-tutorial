import React, { useState, useEffect } from 'react';
import PublicDataList from './PublicDataList';
import { getPublicFacilities } from '../services/publicDataService';
import './PublicDataApp.css';

/**
 * 공공데이터 애플리케이션 메인 컴포넌트
 */
const PublicDataApp = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API 키 상태 확인
    const hasApiKey = import.meta.env.VITE_PUBLIC_DATA_API_KEY &&
        import.meta.env.VITE_PUBLIC_DATA_API_KEY.trim() !== '' &&
        import.meta.env.VITE_PUBLIC_DATA_API_KEY !== 'YOUR_API_KEY_HERE';

    // 컴포넌트 마운트 시 초기 데이터 로딩
    useEffect(() => {
        loadData();
    }, []);

    /**
     * 데이터 로딩 함수
     */
    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getPublicFacilities();
            setData(result);
        } catch (err) {
            setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * 재시도 핸들러
     */
    const handleRetry = () => {
        loadData();
    };

    return (
        <div className="public-data-app">
            <header className="app-header">
                <h1>대구 북구 공유개방 주차장 조회</h1>
                <p>대구광역시 북구 공유개방 주차장 현황 정보를 제공합니다</p>
            </header>

            <main className="app-main">
                <PublicDataList
                    data={data}
                    loading={loading}
                    error={error}
                    onRetry={handleRetry}
                />
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <div className="api-status">
                        {hasApiKey ? (
                            <p className="api-status-success">
                                ✅ <strong>실제 공공데이터 API 사용 중</strong>
                            </p>
                        ) : (
                            <p className="api-status-demo">
                                🔧 <strong>모의 데이터 사용 중</strong>
                            </p>
                        )}
                    </div>

                    <p>
                        <strong>데이터 정보:</strong>
                        대구광역시 북구 공유개방 주차장 현황 데이터를 제공합니다.
                        <br />
                        <strong>API 정보:</strong> <code>api.odcloud.kr</code> 기반의 공공데이터 API 사용
                        <br />
                        <strong>Swagger 문서:</strong> <a href="https://infuser.odcloud.kr/oas/docs?namespace=15096534/v1" target="_blank" rel="noopener noreferrer">
                            API 문서 보기
                        </a>
                    </p>

                    <p>
                        <strong>API 키 설정 방법:</strong>
                        실제 공공데이터포털 API를 사용하려면 <code>.env</code> 파일을 생성하고
                        <code>VITE_PUBLIC_DATA_API_KEY</code> 환경변수를 설정해야 합니다.
                    </p>

                    <div className="setup-steps">
                        <ol>
                            <li><a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer">공공데이터포털</a>에서 회원가입</li>
                            <li>"대구광역시 북구 공유개방 주차장 현황" API 서비스 신청</li>
                            <li><code>VITE_PUBLIC_DATA_API_KEY</code>에 발급받은 키 입력</li>
                        </ol>
                    </div>

                    {!hasApiKey && (
                        <p className="demo-notice">
                            현재는 모의 데이터를 사용하여 대구 북구 주차장 현황을 시연하고 있습니다.
                        </p>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default PublicDataApp;
