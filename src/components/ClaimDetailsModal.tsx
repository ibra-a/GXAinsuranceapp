import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, MapPin, Car, FileText, CheckCircle2, Upload, MessageSquare, X } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';

interface ClaimDetailsModalProps {
  claim: any;
  onClose: () => void;
}

const statusConfig = {
  'in-progress': {
    label: 'In Progress',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    progress: 65,
  },
  'approved': {
    label: 'Approved',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    progress: 100,
  },
  'pending': {
    label: 'Pending Review',
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    progress: 25,
  },
};

export function ClaimDetailsModal({ claim, onClose }: ClaimDetailsModalProps) {
  const status = statusConfig[claim.status as keyof typeof statusConfig];

  const timeline = [
    { date: '2024-10-20 09:15', event: 'Claim submitted', description: 'Initial claim filed online', completed: true },
    { date: '2024-10-21 14:30', event: 'Documents verified', description: 'All required documents received', completed: true },
    { date: '2024-10-23 11:20', event: 'Assessment in progress', description: 'Expert assigned to your case', completed: claim.status !== 'pending' },
    { date: 'Estimated: 2024-10-26', event: 'Final decision', description: 'Claim review completion', completed: claim.status === 'approved' },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0" aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>Claim Details for {claim.id}</DialogTitle>
        </DialogHeader>
        
        {/* Header with gradient */}
        <div className={`relative bg-gradient-to-r ${status.gradient} p-6 sm:p-8`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm border border-white/30`}>
                {status.label}
              </div>
            </div>
            <h2 className="text-white mb-2">{claim.id}</h2>
            <p className="text-white/80 text-sm">{claim.type} Claim</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Claim Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Date of Incident</div>
                <div className="text-sm text-gray-900">
                  {new Date(claim.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Location</div>
                <div className="text-sm text-gray-900">{claim.location}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Vehicle</div>
                <div className="text-sm text-gray-900">{claim.vehicle}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Claim Type</div>
                <div className="text-sm text-gray-900">{claim.type}</div>
              </div>
            </motion.div>
          </div>

          <Separator />

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">Claim Progress</h3>
              <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${status.gradient} text-white`}>
                {status.progress}%
              </span>
            </div>
            <Progress value={status.progress} className="h-3" />
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="text-gray-900 mb-5">Processing Timeline</h3>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        item.completed
                          ? `bg-gradient-to-br ${status.gradient} shadow-lg`
                          : 'bg-gray-200'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          item.completed ? `bg-gradient-to-b ${status.gradient}` : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className={`mb-1 ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.event}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{item.description}</div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Estimated Amount */}
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${status.gradient} p-6`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
            <div className="relative">
              <div className="text-sm text-white/80 mb-2">Estimated Claim Amount</div>
              <div className="text-3xl text-white">{claim.amount}</div>
              <div className="text-xs text-white/70 mt-2">Subject to final assessment</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <Button className={`bg-gradient-to-r ${status.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all h-12`}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <Button variant="outline" className="border-2 h-12 hover:bg-gray-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Adjuster
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
