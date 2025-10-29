// Localization settings for GXA Djibouti

export const LOCALE = {
  country: 'Djibouti',
  language: 'fr-DJ', // French (Djibouti)
  currency: 'DJF',
  currencySymbol: 'Fdj', // Djiboutian Franc
  phonePrefix: '+253',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

// Format currency for Djibouti
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-DJ', {
    style: 'currency',
    currency: 'DJF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format phone number for Djibouti
export function formatPhoneNumber(phone: string): string {
  // Remove any existing formatting
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it already has country code
  if (cleaned.startsWith('253')) {
    return `+253 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  
  // Add country code if not present
  return `+253 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
}

// Format date for Djibouti locale
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-DJ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// Format date and time for Djibouti locale
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-DJ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Common Djibouti-specific translations
export const TRANSLATIONS = {
  welcome: 'Bienvenue',
  dashboard: 'Tableau de Bord',
  newClaim: 'Nouvelle Réclamation',
  claims: 'Réclamations',
  status: 'Statut',
  pending: 'En Attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  submit: 'Soumettre',
  cancel: 'Annuler',
  close: 'Fermer',
  loading: 'Chargement...',
  save: 'Enregistrer',
  edit: 'Modifier',
  delete: 'Supprimer',
  search: 'Rechercher',
  filter: 'Filtrer',
  total: 'Total',
  details: 'Détails',
  photos: 'Photos',
  date: 'Date',
  time: 'Heure',
  location: 'Lieu',
  description: 'Description',
  vehicleInfo: 'Informations du Véhicule',
  contactInfo: 'Informations de Contact',
  accidentInfo: 'Informations sur l\'Accident',
};

// Djibouti vehicle makes (common in region)
export const VEHICLE_MAKES = [
  'Toyota',
  'Nissan',
  'Mitsubishi',
  'Hyundai',
  'Kia',
  'Suzuki',
  'Honda',
  'Isuzu',
  'Land Rover',
  'Mercedes-Benz',
  'Peugeot',
  'Renault',
  'Citroën',
  'Autre',
];


