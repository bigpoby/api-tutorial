import React from 'react';
import './PublicDataList.css';

/**
 * 공유개방 주차장 아이템 컴포넌트
 */
const PublicFacilityItem = ({ facility }) => {
    return (
        <div className="facility-item">
            <div className="facility-header">
                <h3 className="facility-name">{facility.주차장명 || facility.name}</h3>
                <span className="facility-capacity">
                    개방 {facility.개방호수}면 / 전체 {facility.면수}면
                </span>
            </div>
            <div className="facility-details">
                <p className="facility-address">
                    <span className="label">주소:</span> {facility.지번주소 || facility.address}
                </p>
                <p className="facility-hours">
                    <span className="label">개방시간:</span> {facility.개방시간}
                </p>
                <p className="facility-period">
                    <span className="label">약정기간:</span> {facility.약정시작일} ~ {facility.약정종료일}
                </p>
                {facility.높이제한시설 && facility.높이제한시설 !== '없음' && (
                    <p className="facility-height">
                        <span className="label">높이제한:</span> {facility.높이제한시설}
                    </p>
                )}
                {facility.비고 && (
                    <p className="facility-note">
                        <span className="label">비고:</span> {facility.비고}
                    </p>
                )}
                {facility.경도 && facility.위도 && (
                    <p className="facility-location">
                        <span className="label">위치:</span>
                        <button
                            className="location-button"
                            onClick={() => window.open(`https://map.kakao.com/link/map/${facility.주차장명},${facility.위도},${facility.경도}`, '_blank')}
                        >
                            지도에서 보기
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

/**
 * 로딩 스피너 컴포넌트
 */
const LoadingSpinner = () => (
    <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>공공데이터를 불러오는 중...</p>
    </div>
);

/**
 * 에러 메시지 컴포넌트
 */
const ErrorMessage = ({ message, onRetry }) => (
    <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>데이터 로딩 실패</h3>
        <p>{message}</p>
        <button onClick={onRetry} className="retry-button">
            다시 시도
        </button>
    </div>
);

/**
 * 빈 결과 컴포넌트
 */
const EmptyResult = () => (
    <div className="empty-container">
        <div className="empty-icon">📭</div>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 검색어로 시도해보세요.</p>
    </div>
);

/**
 * 공공데이터 목록 컴포넌트
 */
const PublicDataList = ({ data, loading, error, onRetry }) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    // OData Cloud API 구조 또는 기존 구조 모두 지원
    let items, totalCount;

    if (data && data.data) {
        // OData Cloud API 구조
        items = data.data;
        totalCount = data.totalCount || data.currentCount;
    } else if (data && data.response && data.response.body && data.response.body.items) {
        // 기존 구조 (하위 호환성)
        items = data.response.body.items;
        totalCount = data.response.body.totalCount;
    } else {
        return <EmptyResult />;
    }

    if (!items || items.length === 0) {
        return <EmptyResult />;
    }

    return (
        <div className="public-data-list">
            <div className="list-header">
                <h2>대구 북구 공유개방 주차장 목록</h2>
                <div className="result-count">
                    총 <strong>{totalCount}</strong>개의 주차장이 있습니다.
                </div>
            </div>

            <div className="facility-grid">
                {items.map((facility, index) => (
                    <PublicFacilityItem
                        key={facility.순번 || index}
                        facility={facility}
                    />
                ))}
            </div>
        </div>
    );
};

export default PublicDataList;
