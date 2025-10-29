import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import gxaLogo from '../assets/405fd0cb3f1987fa2551094b264c5e05f448d921.png';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Admin Navigation Bar - Desktop Optimized */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={gxaLogo} 
                alt="GXA Assurances" 
                className="h-10 md:h-12"
              />
              <div className="hidden md:block border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">Tableau de Bord Administrateur</h1>
                <p className="text-sm text-gray-500">Gestion des Réclamations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Accueil</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <AdminDashboard />
    </div>
  );
}

