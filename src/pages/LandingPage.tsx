import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Camera, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Smartphone, 
  Shield,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Zap,
  Users
} from 'lucide-react';
import gxaLogo from '../assets/405fd0cb3f1987fa2551094b264c5e05f448d921.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          {/* Logo and Header */}
          <div className="text-center mb-12">
            <img 
              src={gxaLogo} 
              alt="GXA Assurances" 
              className="h-20 md:h-28 mx-auto mb-8 drop-shadow-2xl"
            />
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Réclamations d'Accidents<br />en 2 Minutes
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              <span className="font-semibold text-blue-200">Protéger</span>, 
              <span className="font-semibold text-green-300"> Soutenir</span>, 
              <span className="font-semibold text-purple-300"> Innover</span>
            </p>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Plateforme digitale moderne pour la soumission et la gestion des réclamations d'assurance automobile à Djibouti
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* User Card */}
            <Card className="p-8 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pour les Assurés</h2>
                <ul className="text-left space-y-3 mb-6 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Camera className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Soumettre avec photos HD en direct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Délai 24 heures respecté automatiquement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Suivi en temps réel de votre réclamation</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/submit-claim')} 
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Soumettre une Réclamation
                </Button>
              </div>
            </Card>
            
            {/* Admin Card */}
            <Card className="p-8 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pour GXA Staff</h2>
                <ul className="text-left space-y-3 mb-6 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Gérer toutes les réclamations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Revoir les photos et métadonnées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                    <span>Tableau de bord avec analyses</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/admin')} 
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Accès Admin
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">2 min</div>
              <div className="text-sm text-gray-600">Temps de soumission</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Plus rapide</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Digital</div>
            </div>
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Transformation Digitale
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* BEFORE - Manual Process */}
            <Card className="p-8 bg-red-50 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
                <XCircle className="h-6 w-6" />
                Processus Actuel
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">2-3 jours</p>
                    <p className="text-sm text-gray-600">Pour soumettre une réclamation complète</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Heures limitées</p>
                    <p className="text-sm text-gray-600">7h30-13h00 & 16h00-18h30 uniquement</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Papier & Téléphone</p>
                    <p className="text-sm text-gray-600">Documents perdus, appels constants</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">30+ minutes par réclamation</p>
                    <p className="text-sm text-gray-600">Saisie manuelle et organisation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Aucun suivi en temps réel</p>
                    <p className="text-sm text-gray-600">Clients appellent constamment pour l'état</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <p className="text-2xl font-bold text-red-900">~50h/mois</p>
                <p className="text-sm text-red-700">de travail manuel répétitif</p>
              </div>
            </Card>
            
            {/* AFTER - Digital Solution */}
            <Card className="p-8 bg-green-50 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Avec GXA Digital
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">2 minutes</p>
                    <p className="text-sm text-gray-600">Soumission complète depuis mobile</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">24h/24, 7j/7</p>
                    <p className="text-sm text-gray-600">Disponible même pendant les weekends</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">100% digital</p>
                    <p className="text-sm text-gray-600">Photos HD, données structurées, sécurisées</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">30 secondes par réclamation</p>
                    <p className="text-sm text-gray-600">Tout est déjà organisé automatiquement</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Suivi en temps réel</p>
                    <p className="text-sm text-gray-600">Clients informés automatiquement</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-900">~3h/mois</p>
                <p className="text-sm text-green-700">94% de temps économisé ✨</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Contact GXA Assurance
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Head Office */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Siège Social</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p>Angle rue d'Ethiopie et Avenue Mohamed Farah Dirir</p>
                    <p>BP200 - Djibouti</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p>+253 21 35 36 36</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p>accueil@gxaonline.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p>Dimanche à Jeudi</p>
                    <p className="text-sm">7h30-13h00 & 16h00-18h30</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Mall Agency */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Agence Bawadi Mall</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p>Bawadi Mall, Rue de Venise</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p>+253 21 34 42 37</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p>accueil@gxaonline.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p>Ouvert 7 jours sur 7</p>
                    <p className="text-sm">9h30 - 22h00</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src={gxaLogo} 
            alt="GXA Assurances" 
            className="h-16 mx-auto mb-4 opacity-90"
          />
          <p className="text-gray-400">
            © 2025 GXA Assurance Djibouti. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            www.gxaonline.com
          </p>
        </div>
      </footer>
    </div>
  );
}

