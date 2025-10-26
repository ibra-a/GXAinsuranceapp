import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Car, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllClaims, type Claim } from '../lib/claims';

interface RecentClaimsProps {
  onClaimClick: (claim: any) => void;
}

const statusConfig = {
  'pending': {
    label: 'Pending Review',
    gradient: 'from-amber-500 to-amber-600',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    progress: 25,
  },
  'approved': {
    label: 'Approved',
    gradient: 'from-green-500 to-green-600',
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    progress: 100,
  },
  'rejected': {
    label: 'Rejected',
    gradient: 'from-red-500 to-red-600',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    progress: 0,
  },
};

export function RecentClaims({ onClaimClick }: RecentClaimsProps) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      setLoading(true);
      const data = await getAllClaims();
      setClaims(data);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-900">Recent Claims</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
          View All
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid gap-4 sm:gap-5">
        {claims.map((claim, index) => {
          const status = statusConfig[claim.status as keyof typeof statusConfig];
          const vehicle = `${claim.vehicle_make} ${claim.vehicle_model} - ${claim.vehicle_plate}`;
          
          return (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group relative overflow-hidden border-2 border-gray-100 hover:border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => onClaimClick(claim)}
              >
                {/* Decorative gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${status.gradient}`} />
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
                
                <div className="relative p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-gray-900">{claim.claim_number}</h3>
                            <div className={`px-3 py-1 rounded-full text-xs ${status.bgColor} border ${status.borderColor}`}>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                                <span className="text-gray-700">{status.label}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {claim.user_name}
                          </Badge>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-0.5">Accident Date</div>
                            <div className="text-sm text-gray-900 truncate">
                              {new Date(claim.accident_datetime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-0.5">Policy #</div>
                            <div className="text-sm text-gray-900 truncate">
                              {claim.policy_number}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 sm:col-span-2 lg:col-span-1">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                            <Car className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-0.5">Vehicle</div>
                            <div className="text-sm text-gray-900 truncate">
                              {vehicle}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-700">{status.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${status.gradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${status.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Description Preview */}
                    <div className="flex lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-3 lg:gap-4 lg:pl-6 lg:border-l border-gray-100">
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-gray-500 mb-1">Description</div>
                        <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                          {claim.accident_description}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
