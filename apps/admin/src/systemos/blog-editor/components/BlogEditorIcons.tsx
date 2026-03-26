interface BlogEditorControlIconProps {
  name: 'back' | 'close' | 'preview' | 'save' | 'publish' | 'approve' | 'return' | 'copy' | 'upload';
}

export function BlogEditorControlIcon({ name }: BlogEditorControlIconProps) {
  if (name === 'back') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
    );
  }

  if (name === 'close') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    );
  }

  if (name === 'save') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h11l3 3v11H5z" />
        <path d="M9 5v5h6" />
        <path d="M9 19v-5h6v5" />
      </svg>
    );
  }

  if (name === 'publish') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (name === 'approve') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5 10 17l9-10" />
      </svg>
    );
  }

  if (name === 'return') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 14 4 9l5-5" />
        <path d="M20 20v-6a5 5 0 0 0-5-5H4" />
      </svg>
    );
  }

  if (name === 'copy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="9" width="10" height="10" rx="2" />
        <path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      </svg>
    );
  }

  if (name === 'upload') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M4 20h16" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
