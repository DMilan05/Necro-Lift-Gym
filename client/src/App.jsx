import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import Logo from './components/Logo';
import TornDivider from './components/TornDivider';
import MembershipsPage from './pages/MembershipsPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen brutal-bg">
        <Logo />
        <TornDivider />
        <nav
          className="flex justify-center gap-8 py-4 text-lg"
          style={{ fontFamily: "'Metal Mania', cursive", color: '#d8d2c4' }}
        >
          <Link to="/" className="hover:text-[#8a0303] transition-colors">Vendégek</Link>
          <Link to="/memberships" className="hover:text-[#8a0303] transition-colors">Bérletek</Link>
          <Link to="/workout-plans" className="hover:text-[#8a0303] transition-colors">Edzéstervek</Link>
        </nav>
        <TornDivider />

        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="/workout-plans" element={<WorkoutPlansPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;