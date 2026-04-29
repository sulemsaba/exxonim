import { useEffect, useState } from "react";


interface PageLoaderProps {
  isLoading?: boolean;
  delay?: number;
}

export function PageLoader({ isLoading = true, delay = 300 }: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const hideTimer = setTimeout(() => {
        setIsHidden(true);
        const removeTimer = setTimeout(() => {
          setShowLoader(false);
        }, 500);
        return () => clearTimeout(removeTimer);
      }, delay);

      return () => clearTimeout(hideTimer);
    } else {
      setShowLoader(true);
      setIsHidden(false);
    }
  }, [isLoading, delay]);

  if (!showLoader) return null;

  return (
    <>
<div className={`page-loader ${isHidden ? "is-hidden" : ""}`} aria-hidden={isHidden}>
        <div className="page-loader__content">
          <div className="page-loader__spinner">
            <div className="page-loader__ring"></div>
            <div className="page-loader__ring"></div>
            <div className="page-loader__ring"></div>
          </div>
          <p className="page-loader__text">Loading</p>
        </div>
      </div>
    </>
  );
}
