import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CesiumMap from './components/CesiumBox';
import ModelViewer from './components/ModelViewer';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Main map view */}
          <Route path="/" element={<CesiumMap />} />
          
          {/* Model viewer with dynamic ID */}
          <Route path="/model-viewer/:modelId" element={<ModelViewer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;