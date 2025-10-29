import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, Home, FileText } from 'lucide-react';
import gxaLogo from '../assets/405fd0cb3f1987fa2551094b264c5e05f448d921.png';

export default function ClaimSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const claimNumber = location.state?.claimNumber || 'CLM-XXXXXX';

  useEffect(() => {
    // Confetti animation or celebration effect could go here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Réclamation Soumise avec Succès!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Votre réclamation a été enregistrée et sera traitée dans les plus brefs délais.
          </p>

          {/* Claim Number */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Numéro de réclamation</p>
            <p className="text-3xl font-bold text-blue-600 font-mono tracking-wider">
              {claimNumber}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Conservez ce numéro pour le suivi de votre réclamation
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prochaines Étapes</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Notre équipe examinera votre réclamation et les photos soumises</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Vous serez contacté dans un délai de 24-48 heures</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Une fois approuvée, vous recevrez les instructions pour la suite</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Besoin d'aide?</strong> Contactez-nous:
            </p>
            <p className="text-blue-600 font-semibold">
              📞 +253 21 35 36 36
            </p>
            <p className="text-blue-600 font-semibold">
              📧 sinistre@gxaonline.com
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour à l'Accueil
            </Button>
            <Button
              onClick={() => navigate('/submit-claim')}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              <FileText className="h-5 w-5 mr-2" />
              Nouvelle Réclamation
            </Button>
          </div>

          {/* Logo */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <img 
              src={gxaLogo} 
              alt="GXA Assurances" 
              className="h-12 mx-auto opacity-70"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

