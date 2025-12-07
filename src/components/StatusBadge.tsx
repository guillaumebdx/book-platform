import type { BookStatus } from '../types/book';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: BookStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'available'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-amber-100 text-amber-700'
      )}
    >
      {status === 'available' ? 'Disponible' : 'Prêté'}
    </span>
  );
}
