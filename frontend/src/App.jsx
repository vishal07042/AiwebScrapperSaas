import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIWebScraper from './AIWebScraper';
import LandingPage from './components/LandingPage';
import Pricing from './components/Pricing';
import ApiDeploymentPage from './components/ApiDeploymentPage';
import ScrapeHistory from './components/ScrapeHistory';
import InputUrlPage2 from './components/InputUrlPage2';
import Landing2 from './components/Landing2';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/deploy" element={<ApiDeploymentPage />} />
        <Route path="/history" element={<ScrapeHistory />} />
        <Route path="/app" element={<InputUrlPage2 />} />
        <Route path='/inputurl' element={<InputUrlPage2 />} />
        <Route path='/deploy' element={<ApiDeploymentPage />} />
       
      </Routes>
     
    </Router>
  );
}

export default App;
