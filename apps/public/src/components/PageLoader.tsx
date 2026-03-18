import { useEffect, useState } from "react";

const pageLoaderStyles = `
  .page-loader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-page) 0%, var(--color-page-strong) 100%);
    opacity: 1;
    pointer-events: auto;
    transition: opacity 500ms cubic-bezier(0.25, 1, 0.25, 1), pointer-events 500ms ease;
  }

  .page-loader.is-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .page-loader__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .page-loader__spinner {
    width: 48px;
    height: 48px;
    position: relative;
  }

  .page-loader__ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--color-accent);
    border-right-color: var(--color-accent-secondary);
    animation: page-loader-spin 1.2s linear infinite;
  }

  .page-loader__ring:nth-child(2) {
    inset: 8px;
    border-top-color: var(--color-accent-secondary);
    border-right-color: transparent;
    animation: page-loader-spin 1.8s linear infinite reverse;
  }

  .page-loader__ring:nth-child(3) {
    inset: 16px;
    border-top-color: var(--color-accent);
    animation: page-loader-spin 2.4s linear infinite;
  }

  .page-loader__text {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    animation: page-loader-fade 1.6s ease-in-out infinite;
  }

  @keyframes page-loader-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes page-loader-fade {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }

  html[data-theme="dark"] .page-loader {
    background: linear-gradient(135deg, var(--color-page) 0%, var(--color-page-strong) 100%);
  }

  @media (prefers-reduced-motion: reduce) {
    .page-loader__ring,
    .page-loader__text {
      animation: none;
    }

    .page-loader__ring {
      border: 2px solid var(--color-accent-soft);
    }
  }
`;

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
      <style>{pageLoaderStyles}</style>
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
