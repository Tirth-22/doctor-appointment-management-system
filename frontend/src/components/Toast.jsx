import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Toast({ type = 'info', message }) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg flex items-center space-x-2 shadow-lg`}>
      <Icon size={20} />
      <span>{message}</span>
    </div>
  );
}
