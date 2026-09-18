import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Calculating valuation...',
}) => {
  return (
    <div className="flex items-center justify-center gap-2.5 py-4 text-neutral-400 text-sm animate-in fade-in duration-150">
      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
      <span>{message}</span>
    </div>
  );
};
