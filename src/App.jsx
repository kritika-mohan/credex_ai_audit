import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Audit from './pages/Audit';
import Results from './pages/Results';
import Share from './pages/Share';
import NotFound from './pages/NotFound';
import { CurrencyProvider } from './context/CurrencyContext';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/results" element={<Results />} />
          <Route path="/result/:id" element={<Share />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black font-sans text-slate-200 selection:bg-indigo-500/30 selection:text-white">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
