import { useState } from 'react';
import gxaLogo from '../assets/405fd0cb3f1987fa2551094b264c5e05f448d921.png';
import { Header } from './Header';
import { StatsOverview } from './StatsOverview';
import { QuickActions } from './QuickActions';
import { RecentClaims } from './RecentClaims';
import { ClaimDetailsModal } from './ClaimDetailsModal';
import { NewClaimModalWithCamera } from './NewClaimModalWithCamera';

export function UserDashboard() {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [showNewClaim, setShowNewClaim] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header logoSrc={gxaLogo} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bienvenue, Ahmed Hassan
          </h1>
          <p className="text-gray-600">Gérez vos réclamations d'accidents automobiles en toute confiance</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Quick Actions */}
        <QuickActions onNewClaim={() => setShowNewClaim(true)} />

        {/* Recent Claims */}
        <RecentClaims onClaimClick={setSelectedClaim} />
      </main>

      {/* Modals */}
      {selectedClaim && (
        <ClaimDetailsModal 
          claim={selectedClaim} 
          onClose={() => setSelectedClaim(null)} 
        />
      )}

      {showNewClaim && (
        <NewClaimModalWithCamera onClose={() => setShowNewClaim(false)} />
      )}
    </div>
  );
}
