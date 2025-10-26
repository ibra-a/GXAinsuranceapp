import { useState } from 'react';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Button } from './components/ui/button';
import { Users, Shield } from 'lucide-react';

type View = 'user' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('user');

  return (
    <div className="min-h-screen">
      {/* View Switcher - Demo purposes */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <Button
          onClick={() => setCurrentView('user')}
          className={`shadow-xl ${
            currentView === 'user'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          User View
        </Button>
        <Button
          onClick={() => setCurrentView('admin')}
          className={`shadow-xl ${
            currentView === 'admin'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin View
        </Button>
      </div>

      {/* Render current view */}
      {currentView === 'user' ? <UserDashboard /> : <AdminDashboard />}
    </div>
  );
}
