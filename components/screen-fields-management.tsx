import React, { useState } from 'react';
import { ArrowLeft, Save, Edit, Search, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useScreenFields } from '@/contexts/ScreenFieldsContext';
import { useToast } from '@/hooks/use-toast';
import { ScreenField } from '@/data/screenFields';

interface ScreenFieldsManagementProps {
  onBack: () => void;
}

const ScreenFieldsManagement: React.FC<ScreenFieldsManagementProps> = ({ onBack }) => {
  const { getScreens, getFieldsByScreen, updateFieldValue, updateFieldConfig } = useScreenFields();
  const [selectedScreen, setSelectedScreen] = useState<string>('dashboard');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const screens = getScreens();
  const screenFields = getFieldsByScreen(selectedScreen);
  
  const filteredFields = screenFields.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStart = (field: ScreenField) => {
    setEditingField(field.id);
    setEditValue(field.value);
  };

  const handleEditSave = (fieldId: string) => {
    updateFieldValue(fieldId, editValue);
    setEditingField(null);
    setEditValue('');
    toast({
      title: "✅ Field Updated",
      description: "Screen field has been updated successfully.",
    });
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleToggleEnabled = (field: ScreenField) => {
    updateFieldConfig(field.id, { isEnabled: !field.isEnabled });
    toast({
      title: field.isEnabled ? "🔒 Field Disabled" : "✅ Field Enabled",
      description: `${field.label} has been ${field.isEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleToggleRequired = (field: ScreenField) => {
    updateFieldConfig(field.id, { isRequired: !field.isRequired });
    toast({
      title: field.isRequired ? "📝 Field Optional" : "⚠️ Field Required",
      description: `${field.label} is now ${field.isRequired ? 'optional' : 'required'}.`,
    });
  };

  const getScreenDisplayName = (screen: string) => {
    const displayNames: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'registration': 'Patient Registration',
      'booking': 'Appointment Booking',
      'vitals': 'Patient Vitals',
      'queue': 'Live Queue',
      'search': 'Patient Search'
    };
    return displayNames[screen] || screen.charAt(0).toUpperCase() + screen.slice(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Screen Fields Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage dynamic text content and field configurations across all screens</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle>Screen Field Configuration</CardTitle>
              <CardDescription>
                Configure text labels, field requirements, and visibility for each screen
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Label htmlFor="screen-select" className="text-sm font-medium whitespace-nowrap">Screen:</Label>
                <Select value={selectedScreen} onValueChange={setSelectedScreen}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select screen" />
                  </SelectTrigger>
                  <SelectContent>
                    {screens.map((screen) => (
                      <SelectItem key={screen} value={screen}>
                        {getScreenDisplayName(screen)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Badge variant="outline" className="text-sm">
              {getScreenDisplayName(selectedScreen)} - {filteredFields.length} fields
            </Badge>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {field.key}
                      </code>
                    </TableCell>
                    <TableCell>
                       {editingField === field.id ? (
                         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                           {field.fieldType === 'checkbox' ? (
                             <Select value={editValue} onValueChange={setEditValue}>
                               <SelectTrigger className="w-full sm:w-24">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="true">True</SelectItem>
                                 <SelectItem value="false">False</SelectItem>
                               </SelectContent>
                             </Select>
                           ) : (
                             <Input
                               value={editValue}
                               onChange={(e) => setEditValue(e.target.value)}
                               className="w-full sm:w-48"
                             />
                           )}
                           <div className="flex space-x-2">
                             <Button
                               size="sm"
                               onClick={() => handleEditSave(field.id)}
                               className="bg-green-600 hover:bg-green-700"
                             >
                               <Save className="w-4 h-4" />
                             </Button>
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={handleEditCancel}
                             >
                               Cancel
                             </Button>
                           </div>
                         </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {field.fieldType === 'checkbox' ? (
                              <Badge variant={field.value === 'true' ? 'default' : 'secondary'}>
                                {field.value === 'true' ? 'Yes' : 'No'}
                              </Badge>
                            ) : (
                              field.value
                            )}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {field.fieldType || 'text'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {field.fieldType !== 'text' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleEnabled(field)}
                          className={`h-8 w-8 p-0 ${field.isEnabled === false ? 'text-red-500' : 'text-green-500'}`}
                        >
                          {field.isEnabled === false ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {field.fieldType !== 'text' && field.isEnabled !== false && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleRequired(field)}
                          className={`h-8 w-8 p-0 ${field.isRequired ? 'text-orange-500' : 'text-gray-400'}`}
                        >
                          {field.isRequired ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                     <TableCell className="text-sm text-gray-600 max-w-xs">
                       <div className="truncate" title={field.description}>
                         {field.description}
                       </div>
                     </TableCell>
                    <TableCell>
                      {editingField !== field.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart(field)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenFieldsManagement; 