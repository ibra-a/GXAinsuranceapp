import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Calendar,
  Car,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Phone,
  Mail,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { updateClaimStatus, type Claim } from '../lib/claims';
import { getTimeRemaining, isWithin24Hours } from '../lib/claims';

interface AdminClaimManagementModalProps {
  claim: Claim;
  onClose: () => void;
}

const statusConfig = {
  'pending': {
    label: 'Pending Review',
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
  },
  'in-progress': {
    label: 'In Progress',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
  'approved': {
    label: 'Approved',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  'rejected': {
    label: 'Rejected',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
  },
};

const priorityConfig = {
  'high': { label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
  'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'low': { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export function AdminClaimManagementModal({ claim, onClose }: AdminClaimManagementModalProps) {
  const [notes, setNotes] = useState(claim.admin_notes || '');
  const [processing, setProcessing] = useState(false);
  const status = statusConfig[claim.status as keyof typeof statusConfig];

  const handleApprove = async () => {
    if (!notes.trim()) {
      toast.error('Please add approval notes');
      return;
    }

    try {
      setProcessing(true);
      await updateClaimStatus(claim.id, 'approved', notes);
      toast.success('Claim approved successfully!', {
        description: `Claim ${claim.claim_number} has been approved`
      });
      setTimeout(() => {
        window.location.reload(); // Refresh to show updated claim
      }, 1500);
    } catch (error) {
      console.error('Error approving claim:', error);
      toast.error('Failed to approve claim');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error('Please add rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await updateClaimStatus(claim.id, 'rejected', notes);
      toast.error('Claim rejected', {
        description: `Claim ${claim.claim_number} has been rejected`
      });
      setTimeout(() => {
        window.location.reload(); // Refresh to show updated claim
      }, 1500);
    } catch (error) {
      console.error('Error rejecting claim:', error);
      toast.error('Failed to reject claim');
    } finally {
      setProcessing(false);
    }
  };

  const withinDeadline = isWithin24Hours(claim.accident_datetime);
  const timeInfo = getTimeRemaining(claim.accident_datetime);
  const vehicle = `${claim.vehicle_make} ${claim.vehicle_model}`;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0" aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>Admin Claim Management for {claim.id}</DialogTitle>
        </DialogHeader>
        
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${status.gradient} p-6 sm:p-8`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm border border-white/30">
                  {status.label}
                </div>
                <Badge className={`${priority.color} border`}>{priority.label} Priority</Badge>
              </div>
              <h2 className="text-white mb-2">{claim.id}</h2>
              <p className="text-white/80 text-sm">{claim.type} Claim • {claim.amount}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white h-10"
                disabled={claim.status === 'approved'}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-10"
                disabled={claim.status === 'rejected'}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* User Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Claimant Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Name</div>
                      <div className="text-sm text-gray-900">{claim.user}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Phone</div>
                      <div className="text-sm text-gray-900">+33 6 12 34 56 78</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Email</div>
                      <div className="text-sm text-gray-900">{claim.user.toLowerCase().replace(' ', '.')}@email.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Policy Number</div>
                      <div className="text-sm text-gray-900">POL-{Math.floor(Math.random() * 10000)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Incident Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Incident Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
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
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-100">
                    <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Location</div>
                      <div className="text-sm text-gray-900">{claim.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 border border-cyan-100">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Vehicle</div>
                      <div className="text-sm text-gray-900">{claim.vehicle}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100">
                    <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Estimated Amount</div>
                      <div className="text-sm text-gray-900">{claim.amount}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-gray-900 mb-3">Incident Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The incident occurred on {new Date(claim.date).toLocaleDateString()} at {claim.location}. 
                  The claimant reported {claim.type.toLowerCase()} involving their {claim.vehicle}. 
                  Estimated damage amounts to {claim.amount}. All required documentation has been submitted 
                  for review.
                </p>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {['Damage Photos', 'Police Report', 'Insurance Card', 'Driver License'].map((doc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 mb-1">{doc}</div>
                        <div className="text-xs text-gray-500">Uploaded • 2.4 MB</div>
                        <Button variant="link" className="h-auto p-0 text-xs text-purple-600 mt-1">
                          View Document →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50/30 transition-all cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Upload additional documents</p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-purple-600 to-pink-600" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="text-gray-900 mb-1">{item.event}</div>
                      <div className="text-sm text-gray-600 mb-2">by {item.user}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Management Tab */}
            <TabsContent value="management" className="space-y-6">
              {/* Assignment */}
              <div>
                <h3 className="text-gray-900 mb-4">Claim Assignment</h3>
                <div className="space-y-3">
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue placeholder="Select adjuster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                      <SelectItem value="Sophie Martin">Sophie Martin</SelectItem>
                      <SelectItem value="Marc Dubois">Marc Dubois</SelectItem>
                      <SelectItem value="Julie Rousseau">Julie Rousseau</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssign} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Assign Claim
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Internal Notes */}
              <div>
                <h3 className="text-gray-900 mb-4">Internal Notes</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this claim for internal reference..."
                  rows={6}
                  className="border-2 focus:border-purple-500"
                />
                <Button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>

              <Separator />

              {/* Status Change */}
              <div>
                <h3 className="text-gray-900 mb-4">Update Status</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleApprove}
                    className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve Claim
                  </Button>
                  <Button
                    onClick={handleReject}
                    className="h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Claim
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
