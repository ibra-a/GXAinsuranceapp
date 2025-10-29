import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { X, Camera, CheckCircle, AlertCircle, Loader2, FileText, Car, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PhotoCaptureStep } from './PhotoCaptureStep';
import { 
  generateClaimNumber, 
  createClaim,
  isWithin24Hours,
  getTimeRemaining
} from '../lib/claims';
import type { ClaimInsert } from '../lib/supabase';
import { 
  validatePhotoSequence,
  type CapturedPhoto 
} from '../lib/photoValidation';

interface NewClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 'info' | 'vehicle' | 'contact' | 'photos-front' | 'photos-rear' | 'photos-left' | 'photos-right' | 'review';

interface FormData {
  user_name: string;
  contact_email: string;
  contact_phone: string;
  policy_number: string;
  accident_datetime: string;
  vehicle_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  accident_description: string;
}

export function NewClaimModalWithCamera({ isOpen, onClose }: NewClaimModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<FormStep>('info');
  const [formData, setFormData] = useState<FormData>({
    user_name: '',
    contact_email: '',
    contact_phone: '',
    policy_number: '',
    accident_datetime: '',
    vehicle_plate: '',
    vehicle_make: '',
    vehicle_model: '',
    accident_description: ''
  });
  
  const [photos, setPhotos] = useState<{
    front?: CapturedPhoto;
    rear?: CapturedPhoto;
    left?: CapturedPhoto;
    right?: CapturedPhoto;
  }>({});
  
  const [claimNumber] = useState(generateClaimNumber());
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isWithinDeadline, setIsWithinDeadline] = useState(true);

  // Update form data
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check 24-hour deadline when accident time changes
    if (field === 'accident_datetime') {
      const within24h = isWithin24Hours(value);
      setIsWithinDeadline(within24h);
      setTimeRemaining(getTimeRemaining(value));
    }
  };

  // Handle photo capture
  const handlePhotoCapture = (angle: 'front' | 'rear' | 'left' | 'right', photo: CapturedPhoto) => {
    setPhotos(prev => ({ ...prev, [angle]: photo }));
    
    // Auto-advance to next photo step
    const nextSteps: Record<string, FormStep> = {
      'photos-front': 'photos-rear',
      'photos-rear': 'photos-left',
      'photos-left': 'photos-right',
      'photos-right': 'review'
    };
    
    if (step in nextSteps) {
      setTimeout(() => setStep(nextSteps[step]), 500);
    }
  };

  // Validate current step
  const canProceed = (): boolean => {
    switch (step) {
      case 'info':
        return !!(
          formData.accident_datetime &&
          formData.accident_description &&
          formData.policy_number &&
          isWithinDeadline
        );
      case 'vehicle':
        return !!(
          formData.vehicle_make &&
          formData.vehicle_model &&
          formData.vehicle_plate
        );
      case 'contact':
        return !!(
          formData.user_name &&
          formData.contact_email &&
          formData.contact_phone
        );
      case 'photos-front':
      case 'photos-rear':
      case 'photos-left':
      case 'photos-right':
        return true; // Photos handled by capture component
      case 'review':
        return !!(photos.front && photos.rear && photos.left && photos.right);
      default:
        return false;
    }
  };

  // Submit claim
  const handleSubmit = async () => {
    if (!photos.front || !photos.rear || !photos.left || !photos.right) {
      toast.error('All 4 photos are required');
      return;
    }

    try {
      setSubmitting(true);

      // Validate photo sequence
      const allPhotos = [photos.front, photos.rear, photos.left, photos.right];
      if (!validatePhotoSequence(allPhotos)) {
        toast.error('Photos must be taken in the same session');
        return;
      }

      // Create claim data
      const claimData: ClaimInsert = {
        claim_number: claimNumber,
        user_name: formData.user_name,
        policy_number: formData.policy_number,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        accident_datetime: formData.accident_datetime,
        vehicle_plate: formData.vehicle_plate,
        vehicle_make: formData.vehicle_make,
        vehicle_model: formData.vehicle_model,
        accident_description: formData.accident_description,
        photo_urls: [
          photos.front.url!,
          photos.rear.url!,
          photos.left.url!,
          photos.right.url!
        ],
        status: 'pending'
      };

      // Submit to Supabase
      const result = await createClaim(claimData);

      if (result) {
        toast.success(`Réclamation ${claimNumber} soumise avec succès!`, {
          description: 'Vous recevrez une confirmation par email sous peu.'
        });
        setTimeout(() => {
          navigate('/claim-success', { state: { claimNumber } });
        }, 1500);
      } else {
        toast.error('Failed to submit claim. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepNumber = (): number => {
    const steps: FormStep[] = ['info', 'vehicle', 'contact', 'photos-front', 'photos-rear', 'photos-left', 'photos-right', 'review'];
    return steps.indexOf(step) + 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0" aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>File New Claim</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="text-white">
            <h2 className="text-white mb-1">File New Claim</h2>
            <p className="text-white/80 text-sm">Claim #{claimNumber}</p>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-white/80 mb-2">
              <span>Step {getStepNumber()} of 8</span>
              <span>{Math.round((getStepNumber() / 8) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${(getStepNumber() / 8) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Accident Info */}
            {step === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Accident Information</h3>
                  <p className="text-sm text-gray-500">Tell us what happened</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policy">Policy Number *</Label>
                  <Input
                    id="policy"
                    value={formData.policy_number}
                    onChange={(e) => updateFormData('policy_number', e.target.value)}
                    placeholder="POL-12345"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="datetime">Accident Date & Time *</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={formData.accident_datetime}
                    onChange={(e) => updateFormData('accident_datetime', e.target.value)}
                    className="h-12"
                    max={new Date().toISOString().slice(0, 16)}
                  />
                  {formData.accident_datetime && (
                    <div className={`text-sm flex items-center gap-2 ${isWithinDeadline ? 'text-green-600' : 'text-red-600'}`}>
                      {isWithinDeadline ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {timeRemaining}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          ⚠️ Claims must be submitted within 24 hours
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">What happened? *</Label>
                  <Textarea
                    id="description"
                    value={formData.accident_description}
                    onChange={(e) => updateFormData('accident_description', e.target.value)}
                    placeholder="Describe the accident in detail..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={() => setStep('vehicle')}
                  disabled={!canProceed()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Continue to Vehicle Info
                </Button>
              </motion.div>
            )}

            {/* Step 2: Vehicle Info */}
            {step === 'vehicle' && (
              <motion.div
                key="vehicle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Vehicle Information</h3>
                  <p className="text-sm text-gray-500">Details about your vehicle</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={formData.vehicle_make}
                      onChange={(e) => updateFormData('vehicle_make', e.target.value)}
                      placeholder="e.g., Toyota"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.vehicle_model}
                      onChange={(e) => updateFormData('vehicle_model', e.target.value)}
                      placeholder="e.g., Camry"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plate">License Plate *</Label>
                  <Input
                    id="plate"
                    value={formData.vehicle_plate}
                    onChange={(e) => updateFormData('vehicle_plate', e.target.value.toUpperCase())}
                    placeholder="AB-123-CD"
                    className="h-12 font-mono"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('info')}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('contact')}
                    disabled={!canProceed()}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Info */}
            {step === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Contact Information</h3>
                  <p className="text-sm text-gray-500">How can we reach you?</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.user_name}
                    onChange={(e) => updateFormData('user_name', e.target.value)}
                    placeholder="Jean Dupont"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => updateFormData('contact_email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => updateFormData('contact_phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="h-12"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('vehicle')}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('photos-front')}
                    disabled={!canProceed()}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Start Photo Capture
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Photo Capture Steps */}
            {(step === 'photos-front' || step === 'photos-rear' || step === 'photos-left' || step === 'photos-right') && (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <PhotoCaptureStep
                  angle={step.replace('photos-', '') as 'front' | 'rear' | 'left' | 'right'}
                  claimNumber={claimNumber}
                  onCapture={(photo) => handlePhotoCapture(step.replace('photos-', '') as any, photo)}
                  existingPhoto={photos[step.replace('photos-', '') as keyof typeof photos]}
                />
              </motion.div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Review & Submit</h3>
                  <p className="text-sm text-gray-500">Verify your claim details</p>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                    <p className="font-semibold">{formData.vehicle_make} {formData.vehicle_model}</p>
                    <p className="text-sm text-gray-600">{formData.vehicle_plate}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Photos Captured</p>
                    <div className="grid grid-cols-4 gap-2">
                      {photos.front && <img src={photos.front.dataUrl} alt="Front" className="rounded aspect-video object-cover" />}
                      {photos.rear && <img src={photos.rear.dataUrl} alt="Rear" className="rounded aspect-video object-cover" />}
                      {photos.left && <img src={photos.left.dataUrl} alt="Left" className="rounded aspect-video object-cover" />}
                      {photos.right && <img src={photos.right.dataUrl} alt="Right" className="rounded aspect-video object-cover" />}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('photos-right')}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !canProceed()}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit Claim
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

