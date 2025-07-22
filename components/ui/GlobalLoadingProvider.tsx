"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Player from "lottie-react";

const GlobalLoadingContext = createContext({
  isLoading: false,
  setLoading: (_: boolean) => {},
});

export const useGlobalLoading = () => useContext(GlobalLoadingContext);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [lottieData, setLottieData] = useState<any>(null);

  // Load Lottie JSON from public folder
  useEffect(() => {
    fetch("/lottie/loading.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch((error) => {
        console.error("Failed to load Lottie animation:", error);
        setLottieData(null);
      });
  }, []);

  // Memoize setLoading to avoid unnecessary re-renders
  const setLoadingSafe = useCallback((val: boolean) => setLoading(val), []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setLoading: setLoadingSafe }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-3">
            {lottieData ? (
              <Player
                autoplay
                loop
                animationData={lottieData}
                style={{ height: 80, width: 80 }}
              />
            ) : (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  );
} 