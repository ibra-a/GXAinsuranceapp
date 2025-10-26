import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, Upload, X, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewClaimModalProps {
  onClose: () => void;
}

export function NewClaimModal({ onClose }: NewClaimModalProps) {
  const [date, setDate] = useState<Date>();
  const [step, setStep] = useState(1);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0" aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>File New Claim</DialogTitle>
        </DialogHeader>
        
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="text-white">
            <h2 className="text-white mb-2">File New Claim</h2>
            <p className="text-white/80 text-sm">Complete the form to submit your accident claim</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`h-2 rounded-full flex-1 transition-all ${
                    s <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-1">Claim Information</h3>
                  <p className="text-sm text-gray-500">Tell us about the incident</p>
                </div>

                {/* Claim Type */}
                <div className="space-y-2">
                  <Label htmlFor="claim-type" className="text-gray-700">
                    Claim Type *
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="claim-type"
                      className="h-12 border-2 focus:border-blue-500"
                    >
                      <SelectValue placeholder="Select the type of incident" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collision">🚗 Collision</SelectItem>
                      <SelectItem value="minor-damage">🔧 Minor Damage</SelectItem>
                      <SelectItem value="parking">🅿️ Parking Incident</SelectItem>
                      <SelectItem value="windshield">🪟 Windshield Damage</SelectItem>
                      <SelectItem value="theft">🔒 Theft</SelectItem>
                      <SelectItem value="vandalism">⚠️ Vandalism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Incident */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Date of Incident *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-12 border-2 hover:border-blue-500"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                        {date ? date.toLocaleDateString() : 'Select the date when incident occurred'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700">
                    Location of Incident *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter street address or location"
                    className="h-12 border-2 focus:border-blue-500"
                  />
                </div>

                {/* Vehicle */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-gray-700">
                    Vehicle Involved *
                  </Label>
                  <Select>
                    <SelectTrigger id="vehicle" className="h-12 border-2 focus:border-blue-500">
                      <SelectValue placeholder="Select your vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicle1">🚙 Peugeot 308 - AB-123-CD</SelectItem>
                      <SelectItem value="vehicle2">🚗 Renault Clio - EF-456-GH</SelectItem>
                      <SelectItem value="vehicle3">🚕 Citroën C3 - IJ-789-KL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-1">Incident Details</h3>
                  <p className="text-sm text-gray-500">Provide additional information</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Description of Incident *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about what happened, including any other parties involved..."
                    rows={6}
                    className="border-2 focus:border-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500">Be as detailed as possible</p>
                </div>

                {/* Estimated Damage */}
                <div className="space-y-2">
                  <Label htmlFor="estimated-damage" className="text-gray-700">
                    Estimated Damage Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <Input
                      id="estimated-damage"
                      type="number"
                      placeholder="0.00"
                      className="h-12 border-2 focus:border-blue-500 pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Optional - will be verified by our experts</p>
                </div>

                {/* Other Party Involved */}
                <div className="space-y-2">
                  <Label htmlFor="other-party" className="text-gray-700">
                    Other Party Involved
                  </Label>
                  <Input
                    id="other-party"
                    placeholder="Name and contact information if applicable"
                    className="h-12 border-2 focus:border-blue-500"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-1">Upload Documents</h3>
                  <p className="text-sm text-gray-500">Add photos and supporting documents</p>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">
                      Photos of damage, police report, witness statements
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>

                  {/* File requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 mb-2">📋 Recommended documents:</p>
                    <ul className="text-xs text-blue-800 space-y-1 ml-4">
                      <li>• Photos of vehicle damage (all angles)</li>
                      <li>• Photos of accident scene</li>
                      <li>• Police report (if filed)</li>
                      <li>• Insurance information of other party</li>
                      <li>• Witness contact information</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 h-12 border-2"
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Claim
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
