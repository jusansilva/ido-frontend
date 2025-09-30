"use client";
import { useEffect } from 'react';

export default function Toast({
  type = 'success',
  message,
  onClose,
  duration = 2500,
}: {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const id = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const bg = type === 'success' ? 'bg-success text-white' : type === 'error' ? 'bg-error text-white' : 'bg-gray-800 text-white';

  return (
    <div className={`fixed top-4 right-4 z-[100] rounded-lg shadow-lg px-4 py-3 ${bg}`} role="status" aria-live="polite">
      <span className="text-sm">{message}</span>
    </div>
  );
}

