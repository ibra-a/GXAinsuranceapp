import { Plus, FileSearch, MessageSquare, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  onNewClaim: () => void;
}

export function QuickActions({ onNewClaim }: QuickActionsProps) {
  const actions = [
    {
      title: 'New Claim',
      description: 'File a new accident claim',
      icon: Plus,
      gradient: 'from-blue-600 to-indigo-600',
      hoverGradient: 'hover:from-blue-700 hover:to-indigo-700',
      onClick: onNewClaim,
      primary: true,
    },
    {
      title: 'Track Claim',
      description: 'Check claim status',
      icon: FileSearch,
      gradient: 'from-violet-500 to-purple-600',
      hoverGradient: 'hover:from-violet-600 hover:to-purple-700',
      primary: false,
    },
    {
      title: 'Message',
      description: 'Contact support',
      icon: MessageSquare,
      gradient: 'from-cyan-500 to-blue-600',
      hoverGradient: 'hover:from-cyan-600 hover:to-blue-700',
      primary: false,
    },
    {
      title: 'Call Us',
      description: '24/7 assistance',
      icon: Phone,
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-700',
      primary: false,
    },
  ];

  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="text-gray-900 mb-5">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0`}
                onClick={action.onClick}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} ${action.hoverGradient} transition-all`} />
                
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative p-6 sm:p-8 flex flex-col items-center text-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white mb-1">{action.title}</div>
                    <div className="text-xs sm:text-sm text-white/80">{action.description}</div>
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
