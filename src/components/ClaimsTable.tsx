import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Download, ChevronRight, Calendar, User, Car, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllClaims, getClaimsByStatus, type Claim } from '../lib/claims';

interface ClaimsTableProps {
  filterStatus: string;
  onClaimClick: (claim: any) => void;
}

const mockClaims = [
  {
    id: 'CLM-2024-001',
    user: 'Jean Dupont',
    type: 'Collision',
    date: '2024-10-20',
    location: 'Rue de la République, Lyon',
    vehicle: 'Peugeot 308 - AB-123-CD',
    status: 'pending',
    amount: '2,450 €',
    priority: 'high',
    assignedTo: 'Unassigned',
  },
  {
    id: 'CLM-2024-002',
    user: 'Marie Laurent',
    type: 'Minor Damage',
    date: '2024-10-19',
    location: 'Avenue des Champs-Élysées, Paris',
    vehicle: 'Renault Clio - EF-456-GH',
    status: 'in-progress',
    amount: '890 €',
    priority: 'medium',
    assignedTo: 'Sophie Martin',
  },
  {
    id: 'CLM-2024-003',
    user: 'Pierre Bernard',
    type: 'Parking Incident',
    date: '2024-10-18',
    location: 'Boulevard de la Croisette, Cannes',
    vehicle: 'Citroën C3 - IJ-789-KL',
    status: 'pending',
    amount: '1,200 €',
    priority: 'low',
    assignedTo: 'Unassigned',
  },
  {
    id: 'CLM-2024-004',
    user: 'Sophie Moreau',
    type: 'Windshield',
    date: '2024-10-17',
    location: 'Autoroute A7, Marseille',
    vehicle: 'Peugeot 308 - MN-234-OP',
    status: 'approved',
    amount: '350 €',
    priority: 'low',
    assignedTo: 'Marc Dubois',
  },
  {
    id: 'CLM-2024-005',
    user: 'Luc Petit',
    type: 'Theft',
    date: '2024-10-16',
    location: 'Rue Saint-Antoine, Nice',
    vehicle: 'BMW X3 - QR-567-ST',
    status: 'in-progress',
    amount: '8,500 €',
    priority: 'high',
    assignedTo: 'Sophie Martin',
  },
  {
    id: 'CLM-2024-006',
    user: 'Claire Dubois',
    type: 'Vandalism',
    date: '2024-10-15',
    location: 'Place Bellecour, Lyon',
    vehicle: 'Audi A4 - UV-890-WX',
    status: 'pending',
    amount: '1,850 €',
    priority: 'medium',
    assignedTo: 'Unassigned',
  },
  {
    id: 'CLM-2024-007',
    user: 'Thomas Richard',
    type: 'Collision',
    date: '2024-10-14',
    location: 'Route Nationale 7, Toulouse',
    vehicle: 'Mercedes C200 - YZ-123-AB',
    status: 'approved',
    amount: '4,200 €',
    priority: 'medium',
    assignedTo: 'Marc Dubois',
  },
  {
    id: 'CLM-2024-008',
    user: 'Emma Rousseau',
    type: 'Minor Damage',
    date: '2024-10-13',
    location: 'Boulevard Haussmann, Paris',
    vehicle: 'Volkswagen Golf - CD-456-EF',
    status: 'rejected',
    amount: '750 €',
    priority: 'low',
    assignedTo: 'Sophie Martin',
  },
];

const statusConfig = {
  'pending': {
    label: 'Pending Review',
    gradient: 'from-amber-500 to-amber-600',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  'in-progress': {
    label: 'In Progress',
    gradient: 'from-orange-500 to-orange-600',
    dotColor: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  'approved': {
    label: 'Approved',
    gradient: 'from-green-500 to-green-600',
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  'rejected': {
    label: 'Rejected',
    gradient: 'from-red-500 to-red-600',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
};

const priorityConfig = {
  'high': { label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
  'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'low': { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export function ClaimsTable({ filterStatus, onClaimClick }: ClaimsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  // Load claims from Supabase
  useEffect(() => {
    loadClaims();
  }, [filterStatus]);

  async function loadClaims() {
    try {
      setLoading(true);
      const data = filterStatus === 'all' 
        ? await getAllClaims()
        : await getClaimsByStatus(filterStatus);
      setClaims(data);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter claims based on search
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.claim_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.vehicle_make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-gray-900">Claims Management</h2>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-2 focus:border-purple-500"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-10 border-2">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest First</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <Button variant="outline" className="h-10 border-2 gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden border-2 border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm text-gray-700">Claim ID</th>
                  <th className="text-left p-4 text-sm text-gray-700">User</th>
                  <th className="text-left p-4 text-sm text-gray-700">Type</th>
                  <th className="text-left p-4 text-sm text-gray-700">Date</th>
                  <th className="text-left p-4 text-sm text-gray-700">Amount</th>
                  <th className="text-left p-4 text-sm text-gray-700">Priority</th>
                  <th className="text-left p-4 text-sm text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm text-gray-700">Assigned To</th>
                  <th className="text-left p-4 text-sm text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim, index) => {
                  const status = statusConfig[claim.status as keyof typeof statusConfig];
                  const vehicle = `${claim.vehicle_make} ${claim.vehicle_model}`;
                  return (
                    <motion.tr
                      key={claim.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors cursor-pointer"
                      onClick={() => onClaimClick(claim)}
                    >
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{claim.claim_number}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-900">{claim.user_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {vehicle}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {new Date(claim.accident_datetime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {claim.photo_urls.length} photos
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {claim.policy_number}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bgColor}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                          <span className={status.textColor}>{status.label}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{claim.contact_email}</span>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid gap-4">
        {filteredClaims.map((claim, index) => {
          const status = statusConfig[claim.status as keyof typeof statusConfig];
          const vehicle = `${claim.vehicle_make} ${claim.vehicle_model}`;
          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-gray-100"
                onClick={() => onClaimClick(claim)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900 mb-1">{claim.claim_number}</h3>
                    <p className="text-sm text-gray-600">{claim.user_name}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bgColor}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                    <span className={status.textColor}>{status.label}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">{vehicle}</Badge>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{claim.photo_urls.length} photos</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(claim.accident_datetime).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {claim.policy_number}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* No results */}
      {filteredClaims.length === 0 && (
        <Card className="p-12 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No claims found matching your criteria</p>
        </Card>
      )}
    </div>
  );
}
