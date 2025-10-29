import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SubmitClaimPage from './pages/SubmitClaimPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ClaimSuccessPage from './pages/ClaimSuccessPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit-claim" element={<SubmitClaimPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/claim-success" element={<ClaimSuccessPage />} />
      </Routes>
    </Router>
  );
}
