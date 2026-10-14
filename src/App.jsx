import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import TextDetector from './pages/TextDetector';
import ModelComparison from './pages/ModelComparison';
import RobustnessTesting from './pages/RobustnessTesting';
import AboutResearch from './pages/AboutResearch';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TextDetector />} />
            <Route path="/comparison" element={<ModelComparison />} />
            <Route path="/robustness" element={<RobustnessTesting />} />
            <Route path="/about" element={<AboutResearch />} />
            {/* Fallback to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
