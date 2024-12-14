import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TokenExpiredNoticeProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenExpiredNotice: React.FC<TokenExpiredNoticeProps> = ({ showModal, setShowModal }) => {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (!showModal) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      router.push('/login');
    }

    return () => clearInterval(timer);
  }, [countdown, router, showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600">Sessão Expirada</h2>
        <p className="mt-4 text-gray-700">
          Sua Sessão expirou. Você será redirecionado para a página de login em <strong>{countdown}</strong> segundos.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Por favor, faça login novamente para continuar.
        </p>
      </div>
    </div>
  );
};

export default TokenExpiredNotice;
