"use client"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider"

export function useRouteLoading() {
  const pathname = usePathname()
  const { setLoading } = useGlobalLoading()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setLoading(true)
      // Simulate a short delay for demo; in real apps, you may want to listen for data fetching completion
      setTimeout(() => setLoading(false), 1)
      prevPath.current = pathname
    }
  }, [pathname, setLoading])
} 