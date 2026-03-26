import { useEffect, useRef, useState } from "react";

interface LoadingSpinnerProps {
  label?: string;
  compact?: boolean;
  minHeight?: string;
}

let nextLoaderId = 1;
const loaderRegistry = {
  active: new Set<number>(),
  leader: 0,
  subscribers: new Set<(leader: number) => void>(),
};

const notifyLeaderOverride = () => {
  const leader = loaderRegistry.leader;
  loaderRegistry.subscribers.forEach((callback) => callback(leader));
};

const registerLoader = (id: number) => {
  loaderRegistry.active.add(id);
  if (!loaderRegistry.leader) {
    loaderRegistry.leader = id;
    notifyLeaderOverride();
  }
  return () => {
    const wasLeader = loaderRegistry.leader === id;
    loaderRegistry.active.delete(id);
    if (wasLeader) {
      loaderRegistry.leader = loaderRegistry.active.values().next().value ?? 0;
      notifyLeaderOverride();
    }
  };
};

const subscribeToLeader = (callback: (leader: number) => void) => {
  loaderRegistry.subscribers.add(callback);
  callback(loaderRegistry.leader);
  return () => loaderRegistry.subscribers.delete(callback);
};

export function LoadingSpinner({
  label = "Loading content...",
  compact = false,
  minHeight,
}: LoadingSpinnerProps) {
  const reservedHeight = minHeight ?? (compact ? undefined : "clamp(18rem, 42vh, 28rem)");
  const idRef = useRef(nextLoaderId++);
  const [leader, setLeader] = useState(loaderRegistry.leader);

  useEffect(() => {
    const unsubscribeLeader = subscribeToLeader(setLeader);
    const unregister = registerLoader(idRef.current);
    return () => {
      unregister();
      unsubscribeLeader();
    };
  }, []);

  if (leader !== idRef.current) {
    return null;
  }

  return (
    <>
      <style>{`
        .loading-spinner {
          display: grid;
          place-items: center;
          gap: 0.9rem;
          padding: ${compact ? "1rem" : "3rem 1.25rem"};
          min-height: ${reservedHeight ?? "auto"};
          color: var(--color-text-muted);
          text-align: center;
        }

        .loading-spinner__orb {
          width: ${compact ? "1.25rem" : "2rem"};
          height: ${compact ? "1.25rem" : "2rem"};
          border: 2px solid rgba(15, 92, 99, 0.18);
          border-top-color: var(--color-accent);
          border-radius: 999px;
          animation: loading-spinner-rotate 0.8s linear infinite;
        }

        .loading-spinner__label {
          margin: 0;
          font-size: ${compact ? "0.9rem" : "1rem"};
          line-height: 1.6;
        }

        @keyframes loading-spinner-rotate {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="loading-spinner" role="status" aria-live="polite">
        <span className="loading-spinner__orb" aria-hidden="true"></span>
        <p className="loading-spinner__label">{label}</p>
      </div>
    </>
  );
}
