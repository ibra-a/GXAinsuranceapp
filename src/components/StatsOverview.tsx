import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { getClaimsStats } from '../lib/claims';

export function StatsOverview() {
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
    },
    {
      title: 'Pending Review',
      value: stats.pending.toString(),
      change: 'Awaiting review',
      icon: AlertCircle,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100/50',
      iconBg: 'bg-amber-500',
      borderColor: 'border-amber-200',
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
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 mb-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group`}>
              {/* Decorative gradient overlay */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative p-5 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-3xl sm:text-4xl bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
