import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertCircle, TrendingUp, XCircle, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { getClaimsStats } from '../lib/claims';

interface AdminStatsOverviewProps {
  onFilterChange: (status: string) => void;
}

export function AdminStatsOverview({ onFilterChange }: AdminStatsOverviewProps) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getClaimsStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statsConfig = [
    {
      title: 'Total Claims',
      value: stats.total.toString(),
      change: 'All time',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      iconBg: 'bg-blue-500',
      borderColor: 'border-blue-200',
      filterValue: 'all',
    },
    {
      title: 'Pending Review',
      value: stats.pending.toString(),
      change: 'Needs attention',
      icon: AlertCircle,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100/50',
      iconBg: 'bg-amber-500',
      borderColor: 'border-amber-200',
      filterValue: 'pending',
    },
    {
      title: 'Approved',
      value: stats.approved.toString(),
      change: 'Processed',
      icon: CheckCircle2,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      iconBg: 'bg-green-500',
      borderColor: 'border-green-200',
      filterValue: 'approved',
    },
    {
      title: 'Rejected',
      value: stats.rejected.toString(),
      change: 'Not approved',
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100/50',
      iconBg: 'bg-red-500',
      borderColor: 'border-red-200',
      filterValue: 'rejected',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 mb-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }
  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="text-gray-900 mb-5">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onFilterChange(stat.filterValue)}
              className="cursor-pointer"
            >
              <Card className={`relative overflow-hidden border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group h-full`}>
                {/* Decorative gradient overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${stat.iconBg} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl sm:text-3xl bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{stat.change}</span>
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
