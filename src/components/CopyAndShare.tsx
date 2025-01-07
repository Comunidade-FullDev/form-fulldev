import { Button } from "@/components/ui/button";
import { Link2, Share2 } from "lucide-react";
import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      <Link2 className="h-4 w-4" />
      <span className="sr-only">Copiar link</span>
    </Button>
  );
}

export function ShareModal({ link, message }: { link: string, message: string }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openModal = () => setIsShareModalOpen(true);
  const closeModal = () => setIsShareModalOpen(false);

  const encodedLink = encodeURIComponent(link);
  const encodedMessage = encodeURIComponent(message);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={openModal}>
        <Share2 className="h-4 w-4" />
        <span className="sr-only">Compartilhar</span>
      </Button>

      {isShareModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end"
          onClick={closeModal}
        >
          <div
            className="bg-gray p-6 rounded-t-lg shadow-lg w-full max-w-md flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">Compartilhar</h2>
            <div className="grid grid-cols-3 gap-6">
              <button
                className="flex flex-col items-center"
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedMessage}`,
                    "_blank"
                  );                }}
              >
                <FaFacebook className="text-blue-600 text-4xl" />
                <span className="text-sm mt-2">Facebook</span>
              </button>
              <button
                className="flex flex-col items-center"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedMessage}`,
                    "_blank"
                  );                }}
              >
                <FaTwitter className="text-blue-400 text-4xl" />
                <span className="text-sm mt-2">Twitter</span>
              </button>
              <button
                className="flex flex-col items-center"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
                    "_blank"
                  );                }}
              >
                <FaWhatsapp className="text-green-500 text-4xl" />
                <span className="text-sm mt-2">WhatsApp</span>
              </button>
            </div>
            <button
              className="mt-6 text-white-500 underline"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
