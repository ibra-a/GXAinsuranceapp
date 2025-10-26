import { useState } from 'react';
import gxaLogo from "../assets/405fd0cb3f1987fa2551094b264c5e05f448d921.png";
import { AdminHeader } from './AdminHeader';
import { AdminStatsOverview } from './AdminStatsOverview';
import { ClaimsTable } from './ClaimsTable';
import { AdminClaimManagementModalNew } from './AdminClaimManagementModalNew';

export function AdminDashboard() {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <AdminHeader logoSrc={gxaLogo} />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-gray-600">Gérer et traiter les réclamations d'assurance efficacement</p>
        </div>

        {/* Stats Overview */}
        <AdminStatsOverview onFilterChange={setFilterStatus} />

        {/* Claims Table */}
        <ClaimsTable 
          filterStatus={filterStatus}
          onClaimClick={setSelectedClaim} 
        />
      </main>

      {/* Claim Management Modal */}
      {selectedClaim && (
        <AdminClaimManagementModalNew 
          claim={selectedClaim} 
          onClose={() => setSelectedClaim(null)} 
        />
      )}
    </div>
  );
}
