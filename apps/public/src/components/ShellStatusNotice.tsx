interface ShellStatusNoticeProps {
  isVisible: boolean;
}

export function ShellStatusNotice({ isVisible }: ShellStatusNoticeProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>{`
        .shell-status-notice {
          position: sticky;
          top: calc(var(--header-height, 0px) + 0.75rem);
          z-index: 35;
          width: min(1120px, calc(100% - 2rem));
          margin: 1rem auto 0;
          padding: 0.9rem 1rem;
          border: 1px solid rgba(15, 92, 99, 0.16);
          border-radius: 1rem;
          background: rgba(247, 247, 244, 0.9);
          color: var(--color-text);
          box-shadow: 0 16px 34px rgba(8, 31, 35, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .shell-status-notice p {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }

        html[data-theme="dark"] .shell-status-notice {
          background: rgba(11, 31, 35, 0.9);
          border-color: rgba(127, 188, 193, 0.18);
        }

        @media (max-width: 700px) {
          .shell-status-notice {
            width: calc(100% - 1.25rem);
          }
        }
      `}</style>
      <div className="shell-status-notice" role="status" aria-live="polite">
        <p>
          Live site data is temporarily unavailable. Exxonim is showing a stable
          fallback shell while sections reconnect in the background.
        </p>
      </div>
    </>
  );
}
