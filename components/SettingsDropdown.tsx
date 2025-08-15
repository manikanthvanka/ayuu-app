
import React, { useState } from 'react';
import { ChevronDown, Settings, Shield, Monitor, Palette, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type ViewMode = 'dashboard' | 'register' | 'booking' | 'queue' | 'return-queue' | 'search' | 'role-management' | 'user-management' | 'patient-history' | 'screen-fields' | 'color-customization' | 'stage-tracking' | 'doctor-consultation' | 'app-schedule' | 'app-configuration';

interface SettingsDropdownProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const settingsItems = [
    {
      id: 'screen-fields' as ViewMode,
      label: 'Screen Fields',
      icon: Monitor
    },
    {
      id: 'role-management' as ViewMode,
      label: 'Role Management',
      icon: Shield
    },
    {
      id: 'user-management' as ViewMode,
      label: 'User Management',
      icon: Users
    },
    {
      id: 'app-configuration' as ViewMode,
      label: 'App Configuration',
      icon: Settings
    },
    {
      id: 'color-customization' as ViewMode,
      label: 'Color Settings',
      icon: Palette
    }
  ];

  const isSettingsActive = settingsItems.some(item => currentView === item.id);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant={isSettingsActive ? "secondary" : "ghost"}
          className={`w-full justify-between h-10 lg:h-11 text-sm lg:text-base ${
            isSettingsActive 
              ? 'bg-primary/10 text-primary border-primary/20' 
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 flex-shrink-0" />
            <span className="truncate">Settings</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-4 mt-1">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-9 text-sm ${
                isActive 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsDropdown;
