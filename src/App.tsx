import { useAuth } from './hooks/useAuth';
import LandingPage from './components/LandingPage';
import PerformerDashboard from './components/PerformerDashboard';
import CustomerDashboard from './components/CustomerDashboard';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 text-lg">Loading TalentHub...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LandingPage />;
  }

  if (profile.user_type === 'performer') {
    return <PerformerDashboard />;
  }

  return <CustomerDashboard />;
}

export default App;
