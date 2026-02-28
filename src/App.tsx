import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScanLine from './components/ScanLine';
import FormPage from './pages/FormPage';
import ViewPage from './pages/ViewPage';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col w-full" style={{ background: '#0a0a0f' }}>
        <ScanLine />
        <Header />
        <main className="flex-1 relative z-10 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/view" element={<ViewPage />} />
            <Route path="/view/:payload" element={<ViewPage />} />
          </Routes>
        </main>
        <footer className="relative w-full z-10 border-t py-3 sm:py-4" style={{ borderColor: '#00f5ff11' }}>
          <div className="w-full px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-[115rem] flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2">
              <span className="data-tag text-[0.6em] sm:text-[0.65em] text-center sm:text-left">QR INFO SYSTEM // CLIENT-SIDE</span>
              <span className="data-tag text-[0.6em] sm:text-[0.65em]">v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
