import { BrowserRouter, Navigate, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import CesiumMap from './components/CesiumBox';
import ModelViewer from './components/ModelViewer';
import TowersPage from './components/TowersPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Home overview */}
          <Route path="/" element={<CesiumMap />} />

          {/* Full-screen map */}
          <Route path="/map" element={<CesiumMap />} />
          <Route path="/map/:modelId" element={<CesiumMap />} />

          {/* Legacy direct tower route redirects to the new map path */}
          <Route path="/:modelId" element={<LegacyTowerRedirect />} />

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

function LegacyTowerRedirect() {
  const { modelId } = useParams();

  return <Navigate replace to={`/map/${modelId}`} />;
}