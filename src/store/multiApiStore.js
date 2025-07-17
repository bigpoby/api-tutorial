import { create } from 'zustand';
import { fetchPublicData, fetchMultipleData, fetchSequentialData, SUPPORTED_APIS } from '../services/apiService';

/**
 * 다중 API 관리 스토어 (Zustand)
 * 여러 공공데이터 API를 동시에 또는 순차적으로 관리
 */
const useMultiApiStore = create((set, get) => ({
  // 전체 상태
  loading: false,
  error: null,
  
  // 개별 API 데이터 저장소
  data: {},
  
  // 개별 API 로딩 상태
  loadingStates: {},
  
  // 개별 API 에러 상태
  errorStates: {},
  
  // API 키 상태
  hasApiKey: import.meta.env.PROD || (
    import.meta.env.VITE_PUBLIC_DATA_API_KEY &&
    import.meta.env.VITE_PUBLIC_DATA_API_KEY.trim() !== '' &&
    import.meta.env.VITE_PUBLIC_DATA_API_KEY !== 'YOUR_API_KEY_HERE'
  ),

  /**
   * 단일 API 데이터 로딩
   * @param {string} apiType - API 타입 (PARKING, LIBRARY, etc.)
   * @param {Object} options - 요청 옵션
   */
  loadSingleData: async (apiType, options = {}) => {
    if (!SUPPORTED_APIS.includes(apiType)) {
      throw new Error(`지원하지 않는 API 타입입니다: ${apiType}`);
    }

    // 개별 API 로딩 상태 설정
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [apiType]: true
      },
      errorStates: {
        ...state.errorStates,
        [apiType]: null
      }
    }));

    try {
      const result = await fetchPublicData(apiType, options);
      
      set(state => ({
        data: {
          ...state.data,
          [apiType]: result
        },
        loadingStates: {
          ...state.loadingStates,
          [apiType]: false
        }
      }));
      
      return result;
    } catch (error) {
      set(state => ({
        loadingStates: {
          ...state.loadingStates,
          [apiType]: false
        },
        errorStates: {
          ...state.errorStates,
          [apiType]: error.message || '데이터를 불러오는 중 오류가 발생했습니다.'
        }
      }));
      
      throw error;
    }
  },

  /**
   * 여러 API 동시 로딩
   * @param {Array} apiRequests - API 요청 배열 [{type, options}, ...]
   */
  loadMultipleData: async (apiRequests) => {
    set({ loading: true, error: null });

    // 모든 요청된 API의 로딩 상태 설정
    const newLoadingStates = {};
    const newErrorStates = {};
    
    apiRequests.forEach(({ type }) => {
      if (SUPPORTED_APIS.includes(type)) {
        newLoadingStates[type] = true;
        newErrorStates[type] = null;
      }
    });

    set(state => ({
      loadingStates: { ...state.loadingStates, ...newLoadingStates },
      errorStates: { ...state.errorStates, ...newErrorStates }
    }));

    try {
      const results = await fetchMultipleData(apiRequests);
      
      const newData = {};
      const finalLoadingStates = {};
      const finalErrorStates = {};
      
      results.forEach(({ type, data, error, success }) => {
        if (success) {
          newData[type] = data;
          finalLoadingStates[type] = false;
          finalErrorStates[type] = null;
        } else {
          finalLoadingStates[type] = false;
          finalErrorStates[type] = error;
        }
      });

      set(state => ({
        data: { ...state.data, ...newData },
        loadingStates: { ...state.loadingStates, ...finalLoadingStates },
        errorStates: { ...state.errorStates, ...finalErrorStates },
        loading: false
      }));

      return results;
    } catch (error) {
      set({ 
        loading: false,
        error: error.message || '다중 API 호출 중 오류가 발생했습니다.'
      });
      
      throw error;
    }
  },

  /**
   * 여러 API 순차적 로딩
   * @param {Array} apiRequests - API 요청 배열
   */
  loadSequentialData: async (apiRequests) => {
    set({ loading: true, error: null });

    try {
      const results = await fetchSequentialData(apiRequests);
      
      const newData = {};
      const finalLoadingStates = {};
      const finalErrorStates = {};
      
      results.forEach(({ type, data, error, success }) => {
        if (success) {
          newData[type] = data;
          finalLoadingStates[type] = false;
          finalErrorStates[type] = null;
        } else {
          finalLoadingStates[type] = false;
          finalErrorStates[type] = error;
        }
      });

      set(state => ({
        data: { ...state.data, ...newData },
        loadingStates: { ...state.loadingStates, ...finalLoadingStates },
        errorStates: { ...state.errorStates, ...finalErrorStates },
        loading: false
      }));

      return results;
    } catch (error) {
      set({ 
        loading: false,
        error: error.message || '순차적 API 호출 중 오류가 발생했습니다.'
      });
      
      throw error;
    }
  },

  /**
   * 특정 API 데이터 가져오기
   * @param {string} apiType - API 타입
   */
  getData: (apiType) => {
    const { data } = get();
    return data[apiType] || null;
  },

  /**
   * 특정 API 로딩 상태 가져오기
   * @param {string} apiType - API 타입
   */
  getLoadingState: (apiType) => {
    const { loadingStates } = get();
    return loadingStates[apiType] || false;
  },

  /**
   * 특정 API 에러 상태 가져오기
   * @param {string} apiType - API 타입
   */
  getErrorState: (apiType) => {
    const { errorStates } = get();
    return errorStates[apiType] || null;
  },

  /**
   * 모든 API 데이터 가져오기
   */
  getAllData: () => {
    const { data } = get();
    return data;
  },

  /**
   * 특정 API 에러 클리어
   * @param {string} apiType - API 타입
   */
  clearError: (apiType) => {
    set(state => ({
      errorStates: {
        ...state.errorStates,
        [apiType]: null
      }
    }));
  },

  /**
   * 모든 에러 클리어
   */
  clearAllErrors: () => {
    set({ error: null, errorStates: {} });
  },

  /**
   * 특정 API 데이터 클리어
   * @param {string} apiType - API 타입
   */
  clearData: (apiType) => {
    set(state => {
      const newData = { ...state.data };
      delete newData[apiType];
      
      const newLoadingStates = { ...state.loadingStates };
      delete newLoadingStates[apiType];
      
      const newErrorStates = { ...state.errorStates };
      delete newErrorStates[apiType];
      
      return {
        data: newData,
        loadingStates: newLoadingStates,
        errorStates: newErrorStates
      };
    });
  },

  /**
   * 모든 데이터 클리어
   */
  clearAllData: () => {
    set({ 
      data: {},
      loadingStates: {},
      errorStates: {},
      error: null 
    });
  },

  /**
   * 특정 API 재시도
   * @param {string} apiType - API 타입
   * @param {Object} options - 요청 옵션
   */
  retryApi: (apiType, options = {}) => {
    const { loadSingleData } = get();
    return loadSingleData(apiType, options);
  },

  /**
   * 모든 API 재시도 (마지막 요청 기준)
   */
  retryAll: () => {
    const { data } = get();
    const apiTypes = Object.keys(data);
    
    if (apiTypes.length === 0) {
      console.warn('재시도할 API가 없습니다.');
      return;
    }
    
    const { loadMultipleData } = get();
    const apiRequests = apiTypes.map(type => ({ type, options: {} }));
    
    return loadMultipleData(apiRequests);
  }
}));

export default useMultiApiStore;
