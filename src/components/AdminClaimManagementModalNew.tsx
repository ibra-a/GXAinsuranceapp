import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
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
  AlertCircle,
} from 'lucide-react';
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

export function AdminClaimManagementModalNew({ claim, onClose }: AdminClaimManagementModalProps) {
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
        window.location.reload();
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
        window.location.reload();
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
          <DialogTitle>Admin Claim Management for {claim.claim_number}</DialogTitle>
        </DialogHeader>
        
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${status.gradient} p-6 sm:p-8`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            disabled={processing}
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm border border-white/30">
                  {status.label}
                </div>
                {!withinDeadline && (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Late Submission
                  </Badge>
                )}
              </div>
              <h2 className="text-white mb-2">{claim.claim_number}</h2>
              <p className="text-white/80 text-sm">{vehicle} • {claim.photo_urls.length} photos</p>
            </div>

            {/* Quick Actions */}
            {claim.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700 text-white h-10"
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-10"
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Claimant Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claimant Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Name</div>
                  <div className="text-sm font-medium text-gray-900">{claim.user_name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Phone</div>
                  <div className="text-sm font-medium text-gray-900">{claim.contact_phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Email</div>
                  <div className="text-sm font-medium text-gray-900">{claim.contact_email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Policy Number</div>
                  <div className="text-sm font-medium text-gray-900">{claim.policy_number}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Make & Model</div>
                  <div className="text-sm font-medium text-gray-900">{vehicle}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-100">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">License Plate</div>
                  <div className="text-sm font-medium text-gray-900 font-mono">{claim.vehicle_plate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 border border-cyan-100">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Accident Date</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(claim.accident_datetime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Accident Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accident Description</h3>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{claim.accident_description}</p>
            </div>
          </div>

          <Separator />

          {/* Photos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <ImageIcon className="h-5 w-5 inline mr-2" />
              Photos ({claim.photo_urls.length})
            </h3>
            {claim.photo_urls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {claim.photo_urls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors group"
                  >
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No photos uploaded</p>
            )}
          </div>

          <Separator />

          {/* Timeline Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Submitted</div>
                  <div className="text-xs text-gray-600">
                    {new Date(claim.submission_datetime).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  withinDeadline ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {withinDeadline ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {withinDeadline ? 'Within 24-hour deadline' : '24-hour deadline exceeded'}
                  </div>
                  <div className="text-xs text-gray-600">{timeInfo}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {claim.status === 'pending' && (
            <>
              <Separator />
              <div>
                <Label htmlFor="admin-notes" className="text-lg font-semibold text-gray-900 mb-4 block">
                  Admin Notes / Decision Reason *
                </Label>
                <Textarea
                  id="admin-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here... (Required for approval/rejection)"
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  These notes will be saved with the claim status
                </p>
              </div>
            </>
          )}

          {/* Existing Admin Notes */}
          {claim.admin_notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Admin Notes</h3>
                <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-gray-700">{claim.admin_notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

