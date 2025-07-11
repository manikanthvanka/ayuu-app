"use client"
import React, { createContext, useContext, useState, useCallback } from "react";
import Lottie from "lottie-react";
import loaderAnimation from "./loader-animation.json";

const GlobalLoadingContext = createContext({
  isLoading: false,
  setLoading: (_: boolean) => {},
});

export const useGlobalLoading = () => useContext(GlobalLoadingContext);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);

  // Memoize setLoading to avoid unnecessary re-renders
  const setLoadingSafe = useCallback((val: boolean) => setLoading(val), []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setLoading: setLoadingSafe }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-3">
            <div className="w-24 h-24">
              <Lottie animationData={loaderAnimation} loop={true} />
            </div>
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  );
} 