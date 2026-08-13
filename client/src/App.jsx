import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import MembershipsPage from './pages/MembershipsPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import FoodLogPage from './pages/FoodLogPage';
import Logo from './components/Logo';
import TornDivider from './components/TornDivider';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen brutal-bg">
        <Logo />
        <TornDivider />
        <nav
          className="flex justify-center gap-8 py-4 text-lg flex-wrap"
          style={{ fontFamily: "'Metal Mania', cursive", color: '#d8d2c4' }}
        >
          <Link to="/" className="hover:text-[#8a0303] transition-colors">Vendégek</Link>
          <Link to="/memberships" className="hover:text-[#8a0303] transition-colors">Bérletek</Link>
          <Link to="/workout-plans" className="hover:text-[#8a0303] transition-colors">Edzéstervek</Link>
          <Link to="/food-log" className="hover:text-[#8a0303] transition-colors">Étkezés</Link>
        </nav>
        <TornDivider />

        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="/workout-plans" element={<WorkoutPlansPage />} />
          <Route path="/food-log" element={<FoodLogPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;