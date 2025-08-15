"use client"

import React from 'react';
import { Clock, User, Edit, X, Printer, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AppointmentCardProps {
  appointment: {
    id?: string;
    patientName: string;
    patientId: string;
    doctorName: string;
    appointmentTime: string;
    appointmentDate: string;
    appointmentType?: string;
    status: string;
    phone?: string;
  };
  onReschedule?: (appointment: any) => void;
  onCancel?: (id: string) => void;
  onPrint?: () => void;
  showActions?: boolean;
  variant?: 'preview' | 'full';
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onReschedule,
  onCancel,
  onPrint,
  showActions = true,
  variant = 'full'
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': 
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Patient Information */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{appointment.patientName}</p>
              <p className="text-sm text-gray-600">MR: {appointment.patientId}</p>
              {appointment.phone && (
                <p className="text-xs text-gray-500">{appointment.phone}</p>
              )}
            </div>
          </div>

          {/* Doctor Information */}
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{appointment.doctorName}</p>
            {appointment.appointmentType && (
              <p className="text-sm text-gray-600">{appointment.appointmentType}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{appointment.appointmentDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{appointment.appointmentTime}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-center">
            <Badge className={`${getStatusColor(appointment.status)} font-medium`}>
              {appointment.status}
            </Badge>
          </div>

          {/* Actions */}
          {showActions && variant === 'full' && (
            <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-gray-100">
              {onReschedule && (
                <Button
                  onClick={() => onReschedule(appointment)}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1 text-xs px-3 py-1 h-auto"
                >
                  <Edit className="w-3 h-3" />
                  <span className="hidden sm:inline">Reschedule</span>
                </Button>
              )}
              {onCancel && (
                <Button
                  onClick={() => onCancel(appointment.id || '')}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1 text-red-600 hover:bg-red-50 text-xs px-3 py-1 h-auto"
                >
                  <X className="w-3 h-3" />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
              )}
              {onPrint && (
                <Button
                  onClick={onPrint}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1 text-xs px-3 py-1 h-auto"
                >
                  <Printer className="w-3 h-3" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard; 