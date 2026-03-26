import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CesiumMap from './components/CesiumBox';
import ModelViewer from './components/ModelViewer';
import TowersPage from './components/TowersPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Main map view */}
          <Route path="/" element={<CesiumMap />} />

          {/* Direct tower route (e.g. /204312) */}
          <Route path="/:modelId" element={<CesiumMap />} />

          {/* Towers dashboard */}
          <Route path="/towers" element={<TowersPage />} />
          <Route path="/tower" element={<TowersPage />} />
          
          {/* Model viewer with dynamic ID */}
          <Route path="/model-viewer/:modelId" element={<ModelViewer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;