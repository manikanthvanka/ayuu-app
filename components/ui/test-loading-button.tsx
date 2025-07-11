"use client"
import { Button } from "./button";
import { useGlobalLoading } from "./GlobalLoadingProvider";

export function TestLoadingButton() {
  const { setLoading } = useGlobalLoading();

  const handleTestLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Button 
      onClick={handleTestLoading}
      variant="outline"
      className="fixed bottom-4 right-4 z-40"
    >
      Test Loading (2s)
    </Button>
  );
} 