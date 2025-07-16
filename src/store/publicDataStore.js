import { create } from 'zustand';
import { getPublicFacilities } from '../services/publicDataService';

/**
 * 공공데이터 상태 관리 스토어 (Zustand)
 */
const usePublicDataStore = create((set, get) => ({
  // 상태
  data: null,
  loading: false,
  error: null,
  
  // API 키 상태 (프로덕션에서는 프록시 사용)
  hasApiKey: import.meta.env.PROD || (
    import.meta.env.VITE_PUBLIC_DATA_API_KEY &&
    import.meta.env.VITE_PUBLIC_DATA_API_KEY.trim() !== '' &&
    import.meta.env.VITE_PUBLIC_DATA_API_KEY !== 'YOUR_API_KEY_HERE'
  ),

  // 액션
  /**
   * 공공데이터 로딩
   */
  loadData: async () => {
    set({ loading: true, error: null });

    try {
      const result = await getPublicFacilities();
      set({ data: result, loading: false });
    } catch (err) {
      set({ 
        error: err.message || '데이터를 불러오는 중 오류가 발생했습니다.',
        loading: false 
      });
    }
  },

  /**
   * 에러 초기화
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * 데이터 초기화
   */
  clearData: () => {
    set({ data: null, error: null });
  },

  /**
   * 재시도 (에러 클리어 후 데이터 재로딩)
   */
  retry: () => {
    const { loadData } = get();
    loadData();
  }
}));

export default usePublicDataStore;
