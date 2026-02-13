import React, { useEffect } from 'react';

interface InfoPopoverProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  title,
  onClose,
  children,
}) => {
  useEffect(() => {
    const closeOnScroll = () => onClose();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('scroll', closeOnScroll, true);
    window.addEventListener('wheel', closeOnScroll, { passive: true });
    window.addEventListener('touchmove', closeOnScroll, { passive: true });
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      window.removeEventListener('scroll', closeOnScroll, true);
      window.removeEventListener('wheel', closeOnScroll);
      window.removeEventListener('touchmove', closeOnScroll);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
      <section
        className="relative w-full max-w-lg rounded-xl surface-panel max-h-[80vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}>
          <h3 className="text-sm font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
};
