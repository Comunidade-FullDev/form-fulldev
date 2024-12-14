import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
  
        <div className="mt-4 space-y-8">
          {children}
        </div>
  
      </div>
    </div>
  )
}
export default Modal;
