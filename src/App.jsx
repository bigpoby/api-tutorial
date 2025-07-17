import React, { useState } from 'react';
import PublicDataApp from './components/PublicDataApp';
import MultiApiApp from './components/MultiApiApp';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('single'); // 'single' or 'multi'

  return (
    <div className="App">
      {/* 뷰 전환 버튼 */}
      <div className="view-switcher">
        <button
          className={`view-btn ${currentView === 'single' ? 'active' : ''}`}
          onClick={() => setCurrentView('single')}
        >
          📊 단일 API
        </button>
        <button
          className={`view-btn ${currentView === 'multi' ? 'active' : ''}`}
          onClick={() => setCurrentView('multi')}
        >
          🌟 다중 API
        </button>
      </div>

      {/* 선택된 뷰 렌더링 */}
      {currentView === 'single' ? <PublicDataApp /> : <MultiApiApp />}
    </div>
  );
}

export default App;
