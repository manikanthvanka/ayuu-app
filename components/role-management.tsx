import React, { useState } from 'react';
import { ArrowLeft, Shield, Users, UserCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface RoleManagementProps {
  onBack: () => void;
  userRole: UserRole;
  userRoles: any[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface RolePermissions {
  [key: string]: {
    name: string;
    icon: any;
    color: string;
    permissions: { [key: string]: boolean };
  };
}

const RoleManagement: React.FC<RoleManagementProps> = ({ onBack, userRole, userRoles }) => {
  const { toast } = useToast();

  const availablePermissions: Permission[] = [
    { id: 'register_patient', name: 'Register Patient', description: 'Can register new patients' },
    { id: 'book_appointment', name: 'Book Appointment', description: 'Can book appointments for patients' },
    { id: 'view_queue', name: 'View Queue', description: 'Can view live queue' },
    { id: 'update_vitals', name: 'Update Vitals', description: 'Can update patient vitals' },
    { id: 'vitals_done', name: 'Mark Vitals Done', description: 'Can mark patient vitals as completed' },
    { id: 'consultation', name: 'Consultation', description: 'Can conduct patient consultations' },
    { id: 'prescribe', name: 'Prescribe Medicine', description: 'Can prescribe medications' },
    { id: 'order_tests', name: 'Order Tests', description: 'Can order medical tests' },
    { id: 'view_history', name: 'View Patient History', description: 'Can view patient medical history' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Can manage user roles and permissions' },
    { id: 'view_reports', name: 'View Reports', description: 'Can view daily reports' },
    { id: 'patient_search', name: 'Patient Search', description: 'Can search for patients' }
  ];

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({
    admin: {
      name: 'Administrator',
      icon: Shield,
      color: 'bg-red-500',
      permissions: {
        register_patient: true,
        book_appointment: true,
        view_queue: true,
        update_vitals: true,
        vitals_done: true,
        consultation: true,
        prescribe: true,
        order_tests: true,
        view_history: true,
        manage_roles: true,
        view_reports: true,
        patient_search: true
      }
    },
    doctor: {
      name: 'Doctor',
      icon: UserCheck,
      color: 'bg-green-500',
      permissions: {
        register_patient: false,
        book_appointment: false,
        view_queue: true,
        update_vitals: false,
        vitals_done: false,
        consultation: true,
        prescribe: true,
        order_tests: true,
        view_history: true,
        manage_roles: false,
        view_reports: false,
        patient_search: true
      }
    },
    staff: {
      name: 'Staff',
      icon: Users,
      color: 'bg-purple-500',
      permissions: {
        register_patient: true,
        book_appointment: true,
        view_queue: true,
        update_vitals: true,
        vitals_done: true,
        consultation: false,
        prescribe: false,
        order_tests: false,
        view_history: true,
        manage_roles: false,
        view_reports: true,
        patient_search: true
      }
    },
    patient: {
      name: 'Patient',
      icon: UserCheck,
      color: 'bg-blue-500',
      permissions: {
        register_patient: false,
        book_appointment: true,
        view_queue: false,
        update_vitals: false,
        vitals_done: false,
        consultation: false,
        prescribe: false,
        order_tests: false,
        view_history: false,
        manage_roles: false,
        view_reports: false,
        patient_search: false
      }
    }
  });

  const handlePermissionToggle = (role: string, permissionId: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        permissions: {
          ...prev[role].permissions,
          [permissionId]: !prev[role].permissions[permissionId]
        }
      }
    }));

    toast({
      title: "✅ Permission Updated",
      description: `Permission ${availablePermissions.find(p => p.id === permissionId)?.name} has been updated for ${rolePermissions[role].name}`,
    });
  };

  if (userRole !== 'admin') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">Only administrators can manage roles and permissions.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
      </div>

      <div className="space-y-6">
        {Object.entries(rolePermissions).map(([roleKey, roleData]) => {
          const IconComponent = roleData.icon;
          return (
            <Card key={roleKey}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${roleData.color} text-white rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{roleData.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {Object.values(roleData.permissions).filter(Boolean).length} of {availablePermissions.length} permissions enabled
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{permission.name}</div>
                        <div className="text-xs text-gray-600">{permission.description}</div>
                      </div>
                      <Switch
                        checked={roleData.permissions[permission.id]}
                        onCheckedChange={() => handlePermissionToggle(roleKey, permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Permission Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(rolePermissions).map(([roleKey, roleData]) => (
              <div key={roleKey} className="text-center p-4 border rounded-lg">
                <div className={`w-12 h-12 ${roleData.color} text-white rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <roleData.icon className="w-6 h-6" />
                </div>
                <h4 className="font-medium">{roleData.name}</h4>
                <Badge variant="outline" className="mt-1">
                  {Object.values(roleData.permissions).filter(Boolean).length} permissions
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement; 