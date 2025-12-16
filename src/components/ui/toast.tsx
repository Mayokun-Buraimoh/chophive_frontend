import { X } from "lucide-react";
import { useEffect } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const bgColor =
    toast.type === "error"
      ? "bg-red-600"
      : toast.type === "success"
      ? "bg-green-600"
      : "bg-blue-600";

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md animate-in slide-in-from-left-5 duration-300`}
    >
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

