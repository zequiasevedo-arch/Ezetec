import React from 'react';
import { Status, Priority } from '../types';

export const StatusBadge: React.FC<{ status?: Status; priority?: Priority }> = ({ status, priority }) => {
  if (status) {
    const colors: Record<string, string> = {
      [Status.QUEUE]: 'bg-slate-100 text-slate-700 border-slate-200',
      [Status.WAITING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [Status.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
      [Status.EXECUTED]: 'bg-green-100 text-green-800 border-green-200',
      [Status.CANCELLED]: 'bg-red-50 text-red-800 border-red-200',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]} whitespace-nowrap`}>{status}</span>;
  }
  if (priority) {
    const colors: Record<string, string> = {
      [Priority.LOW]: 'bg-slate-100 text-slate-700',
      [Priority.MEDIUM]: 'bg-blue-50 text-blue-700',
      [Priority.HIGH]: 'bg-red-100 text-red-700 font-bold',
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[priority]} whitespace-nowrap`}>{priority}</span>;
  }
  return null;
};