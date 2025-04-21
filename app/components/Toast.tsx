import { useEffect } from 'react';
import { toast } from 'sonner';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning';
}

export default function Toast({ message, isVisible, onClose, type = 'success' }: ToastProps) {
  useEffect(() => {
    let toastId: number | string;

    if (isVisible && message) {
      const toastOptions = {
        duration: 2000,
        onDismiss: () => {
          onClose();
        },
      };

      switch (type) {
        case 'success':
          toastId = toast.success(message, toastOptions);
          break;
        case 'error':
          toastId = toast.error(message, toastOptions);
          break;
        case 'warning':
          toastId = toast.warning(message, toastOptions);
          break;
        default:
          toastId = toast(message, toastOptions);
      }
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [message, type, isVisible, onClose]);

  return null;
}

// Add fade-in animation to tailwind config
const fadeInAnimation = {
  'fade-in': {
    '0%': {
      opacity: '0',
      transform: 'translateY(-10px)',
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0)',
    },
  },
};
