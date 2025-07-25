import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, UserCheck, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LoadingSpinner from '../ui/loading-spinner';

interface PatientRegistrationProps {
  onSubmit: (patientData: any) => void;
  onBack: () => void;
  onBookAppointment?: (patientData: any) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onSubmit, onBack, onBookAppointment }) => {
  const [loading, setLoading] = useState(false);
  const [showMRNumber, setShowMRNumber] = useState(false);
  const [generatedMRNumber, setGeneratedMRNumber] = useState('');
  const [appointmentIntent, setAppointmentIntent] = useState<'now' | 'later' | 'none'>('none');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    insuranceDetails: '',
    existingConditions: '',
    paymentMode: 'Cash',
    privacyConsent: false,
    isDependent: false,
    guardianName: '',
    guardianPhone: ''
  });
  const { toast } = useToast();

  // Static required/enabled logic
  const requiredFields = {
    firstName: true,
    lastName: true,
    email: false,
    phone: true,
    gender: true,
    dateOfBirth: true,
    address: false,
    emergencyContact: false,
    paymentMode: true,
    privacyConsent: true,
    guardianName: true,
    guardianPhone: true,
  };

  const enabledFields = {
    email: true,
    address: true,
  };

  const generateMRNumber = () => {
    const prefix = 'MR';
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${month}${random}`;
  };

  const copyMRNumber = () => {
    navigator.clipboard.writeText(generatedMRNumber);
    toast({
      title: "📋 Copied!",
      description: "MR Number copied to clipboard",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mrNumber = generateMRNumber();
    setGeneratedMRNumber(mrNumber);
    const patientData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
      mrNumber,
      registrationDate: new Date().toISOString().split('T')[0],
      appointmentIntent,
    };

    toast({
      title: "✅ Registration Successful!",
      description: `MR Number: ${mrNumber} has been assigned to ${patientData.name}`,
    });

    onSubmit(patientData);
    setLoading(false);
    setShowMRNumber(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment({ 
        mrNumber: generatedMRNumber, 
        name: `${formData.firstName} ${formData.lastName}` 
      });
    }
  };

  if (showMRNumber) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span>Patient Registered!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm text-gray-600">MR Number</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  value={generatedMRNumber} 
                  readOnly 
                  className="text-center font-mono text-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMRNumber}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {appointmentIntent !== 'none' && (
                <Button 
                  onClick={handleBookAppointment}
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <Button variant="outline" size="sm" onClick={onBack} disabled={loading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Patient Registration
        </h2>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>New Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-4 pb-24">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name {requiredFields.firstName && '*'}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required={requiredFields.firstName}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  Last Name {requiredFields.lastName && '*'}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required={requiredFields.lastName}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enabledFields.email && (
                <div>
                  <Label htmlFor="email">
                    Email {requiredFields.email && '*'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required={requiredFields.email}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="phone">
                  Phone {requiredFields.phone && '*'}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required={requiredFields.phone}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">
                  Gender {requiredFields.gender && '*'}
                </Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">
                  Date of Birth {requiredFields.dateOfBirth && '*'}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="pl-10"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required={requiredFields.dateOfBirth}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            {enabledFields.address && (
              <div>
                <Label htmlFor="address">
                  Address {requiredFields.address && '*'}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    id="address"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    required={requiredFields.address}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div>
              <Label htmlFor="emergencyContact">
                Emergency Contact {requiredFields.emergencyContact && '*'}
              </Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="emergencyContact"
                  className="pl-10"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  required={requiredFields.emergencyContact}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Dependent Support */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDependent"
                checked={formData.isDependent}
                onCheckedChange={(checked) => handleInputChange('isDependent', checked)}
                disabled={loading}
              />
              <Label htmlFor="isDependent">Register as dependent (child/elder under guardian)</Label>
            </div>

            {formData.isDependent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <Label htmlFor="guardianName">Guardian Name *</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    required={formData.isDependent}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                  <Input
                    id="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                    required={formData.isDependent}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Insurance and Medical Information */}
            <div>
              <Label htmlFor="insuranceDetails">Insurance Details</Label>
              <Textarea
                id="insuranceDetails"
                value={formData.insuranceDetails}
                onChange={(e) => handleInputChange('insuranceDetails', e.target.value)}
                rows={2}
                placeholder="Insurance provider, policy number, etc."
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="existingConditions">Existing Medical Conditions</Label>
              <Textarea
                id="existingConditions"
                value={formData.existingConditions}
                onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                rows={3}
                placeholder="Please list any existing medical conditions, allergies, or medications"
                disabled={loading}
              />
            </div>

            {/* Payment Mode */}
            <div>
              <Label htmlFor="paymentMode">Payment Mode *</Label>
              <Select 
                value={formData.paymentMode} 
                onValueChange={(value) => handleInputChange('paymentMode', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Book Appointment Option */}
            <div className="space-y-2">
              <Label>Book Appointment</Label>
              <RadioGroup
                value={appointmentIntent}
                onValueChange={val => setAppointmentIntent(val as 'now' | 'later' | 'none')}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="book-now" />
                  <Label htmlFor="book-now">Book appointment now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="later" id="book-later" />
                  <Label htmlFor="book-later">Book appointment later</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="no-appointment" />
                  <Label htmlFor="no-appointment">No appointment</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Privacy Consent */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) => handleInputChange('privacyConsent', checked)}
                required
                disabled={loading}
              />
              <Label htmlFor="privacyConsent">
                I consent to the collection and processing of my personal data for healthcare purposes *
              </Label>
            </div>

            {/* Submit Button - sticky footer */}
            <div className="fixed left-0 right-0 bottom-0 z-10 bg-white border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 max-w-3xl mx-auto">
              <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.privacyConsent || loading}
                className="min-w-[140px]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Registering...</span>
                  </div>
                ) : (
                  'Register Patient'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration; 