"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScreenField, allScreenFields } from '@/data/screenFields';

interface ScreenFieldsContextType {
  screenFields: ScreenField[];
  getFieldValue: (key: string, screen: string) => string;
  getFieldConfig: (key: string, screen: string) => ScreenField | undefined;
  updateFieldValue: (id: string, newValue: string) => void;
  updateFieldConfig: (id: string, updates: Partial<ScreenField>) => void;
  getScreens: () => string[];
  getFieldsByScreen: (screen: string) => ScreenField[];
}

const ScreenFieldsContext = createContext<ScreenFieldsContextType | undefined>(undefined);

export const useScreenFields = () => {
  const context = useContext(ScreenFieldsContext);
  if (!context) {
    throw new Error('useScreenFields must be used within a ScreenFieldsProvider');
  }
  return context;
};

interface ScreenFieldsProviderProps {
  children: ReactNode;
}

export const ScreenFieldsProvider: React.FC<ScreenFieldsProviderProps> = ({ children }) => {
  const [screenFields, setScreenFields] = useState<ScreenField[]>(allScreenFields);

  const getFieldValue = (key: string, screen: string): string => {
    const field = screenFields.find(f => f.key === key && f.screen === screen);
    return field?.value || key;
  };

  const getFieldConfig = (key: string, screen: string): ScreenField | undefined => {
    return screenFields.find(f => f.key === key && f.screen === screen);
  };

  const updateFieldValue = (id: string, newValue: string) => {
    setScreenFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  const updateFieldConfig = (id: string, updates: Partial<ScreenField>) => {
    setScreenFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const getScreens = (): string[] => {
    const screens = [...new Set(screenFields.map(field => field.screen))];
    return screens.sort();
  };

  const getFieldsByScreen = (screen: string): ScreenField[] => {
    return screenFields.filter(field => field.screen === screen);
  };

  return (
    <ScreenFieldsContext.Provider value={{
      screenFields,
      getFieldValue,
      getFieldConfig,
      updateFieldValue,
      updateFieldConfig,
      getScreens,
      getFieldsByScreen
    }}>
      {children}
    </ScreenFieldsContext.Provider>
  );
}; 