import React, { useEffect, useState } from 'react';
import useMultiApiStore from '../store/multiApiStore';
import { SUPPORTED_APIS } from '../services/apiService';
import './MultiApiApp.css';

/**
 * 다중 API 관리 컴포넌트
 * 여러 공공데이터 API를 동시에 또는 순차적으로 호출하고 결과를 표시
 */
const MultiApiApp = () => {
    const {
        loading,
        error,
        hasApiKey,
        loadSingleData,
        loadMultipleData,
        loadSequentialData,
        getData,
        getLoadingState,
        getErrorState,
        getAllData,
        clearAllErrors,
        clearAllData,
        retryApi,
        retryAll
    } = useMultiApiStore();

    const [selectedApis, setSelectedApis] = useState(['PARKING']);
    const [loadingMode, setLoadingMode] = useState('parallel'); // parallel, sequential, single

    // 컴포넌트 마운트 시 기본 API 로드
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                if (loadingMode === 'single') {
                    // 단일 API 호출
                    for (const apiType of selectedApis) {
                        await loadSingleData(apiType);
                    }
                } else if (loadingMode === 'parallel') {
                    // 병렬 호출
                    const apiRequests = selectedApis.map(type => ({ type, options: {} }));
                    await loadMultipleData(apiRequests);
                } else if (loadingMode === 'sequential') {
                    // 순차 호출
                    const apiRequests = selectedApis.map(type => ({ type, options: {} }));
                    await loadSequentialData(apiRequests);
                }
            } catch (error) {
                console.error('초기 데이터 로딩 실패:', error);
            }
        };

        loadInitialData();
    }, [loadSingleData, loadMultipleData, loadSequentialData, selectedApis, loadingMode]);

    /**
     * 선택된 API들 데이터 로드
     */
    const handleLoadData = async () => {
        try {
            if (loadingMode === 'single') {
                // 단일 API 호출
                for (const apiType of selectedApis) {
                    await loadSingleData(apiType);
                }
            } else if (loadingMode === 'parallel') {
                // 병렬 호출
                const apiRequests = selectedApis.map(type => ({ type, options: {} }));
                await loadMultipleData(apiRequests);
            } else if (loadingMode === 'sequential') {
                // 순차 호출
                const apiRequests = selectedApis.map(type => ({ type, options: {} }));
                await loadSequentialData(apiRequests);
            }
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }
    };

    /**
     * API 선택 토글
     */
    const toggleApiSelection = (apiType) => {
        setSelectedApis(prev =>
            prev.includes(apiType)
                ? prev.filter(type => type !== apiType)
                : [...prev, apiType]
        );
    };

    /**
     * 모든 API 선택/해제
     */
    const toggleAllApis = () => {
        setSelectedApis(prev =>
            prev.length === SUPPORTED_APIS.length ? [] : [...SUPPORTED_APIS]
        );
    };

    /**
     * API 데이터 렌더링
     */
    const renderApiData = (apiType) => {
        const data = getData(apiType);
        const isLoading = getLoadingState(apiType);
        const error = getErrorState(apiType);

        if (isLoading) {
            return <div className="loading">로딩 중...</div>;
        }

        if (error) {
            return (
                <div className="error">
                    <p>❌ {error}</p>
                    <button onClick={() => retryApi(apiType)}>
                        재시도
                    </button>
                </div>
            );
        }

        if (!data) {
            return <div className="no-data">데이터가 없습니다.</div>;
        }

        return (
            <div className="api-data">
                <div className="data-summary">
                    <span>총 {data.totalCount || 0}개</span>
                    <span>현재 {data.currentCount || 0}개</span>
                    {data._notice && <div className="notice">{data._notice}</div>}
                </div>

                <div className="data-grid">
                    {data.data && data.data.map((item, index) => (
                        <div key={index} className="data-item">
                            {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="data-field">
                                    <span className="field-label">{key}:</span>
                                    <span className="field-value">{value}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    /**
     * API 타입별 한글 이름 매핑
     */
    const getApiDisplayName = (apiType) => {
        const names = {
            PARKING: '주차장',
            LIBRARY: '도서관',
            PARK: '공원',
            CULTURE: '문화시설'
        };
        return names[apiType] || apiType;
    };

    return (
        <div className="multi-api-app">
            <h1>🌟 다중 공공데이터 API 관리</h1>

            {/* API 키 상태 표시 */}
            <div className={`api-key-status ${hasApiKey ? 'valid' : 'invalid'}`}>
                {hasApiKey ? '🔑 API 키 설정됨' : '⚠️ API 키 미설정 (모의 데이터 사용)'}
            </div>

            {/* 제어 패널 */}
            <div className="control-panel">
                <div className="api-selection">
                    <h3>API 선택</h3>
                    <div className="api-checkboxes">
                        {SUPPORTED_APIS.map(apiType => (
                            <label key={apiType} className="api-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedApis.includes(apiType)}
                                    onChange={() => toggleApiSelection(apiType)}
                                />
                                {getApiDisplayName(apiType)}
                            </label>
                        ))}
                    </div>
                    <button
                        className="toggle-all-btn"
                        onClick={toggleAllApis}
                    >
                        {selectedApis.length === SUPPORTED_APIS.length ? '모두 해제' : '모두 선택'}
                    </button>
                </div>

                <div className="loading-mode">
                    <h3>로딩 모드</h3>
                    <div className="mode-options">
                        <label>
                            <input
                                type="radio"
                                value="parallel"
                                checked={loadingMode === 'parallel'}
                                onChange={(e) => setLoadingMode(e.target.value)}
                            />
                            병렬 호출 (빠름)
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="sequential"
                                checked={loadingMode === 'sequential'}
                                onChange={(e) => setLoadingMode(e.target.value)}
                            />
                            순차 호출 (안정적)
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="single"
                                checked={loadingMode === 'single'}
                                onChange={(e) => setLoadingMode(e.target.value)}
                            />
                            개별 호출 (단계별)
                        </label>
                    </div>
                </div>

                <div className="action-buttons">
                    <button
                        className="load-btn"
                        onClick={handleLoadData}
                        disabled={loading || selectedApis.length === 0}
                    >
                        {loading ? '로딩 중...' : '데이터 로드'}
                    </button>
                    <button
                        className="retry-btn"
                        onClick={retryAll}
                        disabled={loading}
                    >
                        모두 재시도
                    </button>
                    <button
                        className="clear-btn"
                        onClick={clearAllData}
                        disabled={loading}
                    >
                        모두 지우기
                    </button>
                </div>
            </div>

            {/* 전체 에러 표시 */}
            {error && (
                <div className="global-error">
                    <p>❌ {error}</p>
                    <button onClick={clearAllErrors}>에러 지우기</button>
                </div>
            )}

            {/* API 데이터 표시 */}
            <div className="api-results">
                {selectedApis.map(apiType => (
                    <div key={apiType} className="api-section">
                        <h2>
                            📊 {getApiDisplayName(apiType)} 데이터
                            {getLoadingState(apiType) && <span className="loading-indicator">🔄</span>}
                            {getErrorState(apiType) && <span className="error-indicator">❌</span>}
                        </h2>
                        {renderApiData(apiType)}
                    </div>
                ))}
            </div>

            {/* 디버그 정보 */}
            <details className="debug-info">
                <summary>🔍 디버그 정보</summary>
                <pre>{JSON.stringify(getAllData(), null, 2)}</pre>
            </details>
        </div>
    );
};

export default MultiApiApp;
