import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NewClaimModalWithCamera } from '../components/NewClaimModalWithCamera';
import gxaLogo from '../assets/405fd0cb3f1987fa2551094b264c5e05f448d921.png';

export default function SubmitClaimPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back after a short delay to allow modal close animation
    setTimeout(() => navigate('/'), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Simple Header - Mobile Optimized */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            
            <img 
              src={gxaLogo} 
              alt="GXA Assurances" 
              className="h-8 sm:h-10"
            />
            
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <NewClaimModalWithCamera 
          isOpen={isOpen}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}

