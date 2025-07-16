import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 서브디렉토리 배포를 위한 base 설정
  base: mode === 'production' ? '/reactapi/' : '/',
  build: {
    rollupOptions: {
      // 빌드 시 PHP 파일과 .htaccess 파일 복사
      external: [],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'parking-data.php') {
            return 'api/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  publicDir: 'public' // public 폴더의 내용을 빌드 시 dist로 복사
}))
