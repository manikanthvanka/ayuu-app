"use client"
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./GlobalLoadingProvider";

export function RouteLoadingListener() {
  const pathname = usePathname();
  const { setLoading } = useGlobalLoading();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show loading when route changes
    setLoading(true);
    
    // Optimized loading durations based on route complexity
    let loadingDuration = 200; // Reduced default duration
    
    // Shorter loading for optimized pages
    if (pathname.includes('/patients/search')) {
      loadingDuration = 300; // Reduced loading time
    } else if (pathname.includes('/dashboard')) {
      loadingDuration = 150; // Very short loading for dashboard
    } else if (pathname.includes('/queue')) {
      loadingDuration = 300; // Reduced loading time
    } else if (pathname.includes('/tracking')) {
      loadingDuration = 300; // Reduced loading time
    } else if (pathname.includes('/patients/register')) {
      loadingDuration = 50; // Ultra-fast loading for registration
    }
    
    // Hide loading after the determined delay
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, loadingDuration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setLoading(false); // Ensure loading is cleared on unmount
      }
    };
  }, [pathname, setLoading]);

  return null; // This component doesn't render anything
} 