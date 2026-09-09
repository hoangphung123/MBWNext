import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastTone = "success" | "info" | "error";
type ToastState = { message: string; tone: ToastTone } | null;
const ToastContext = createContext<{ showToast: (message: string, tone?: ToastTone) => void } | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = useCallback((message: string, tone: ToastTone = "success") => setToast({ message, tone }), []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 2800); return () => window.clearTimeout(timer); }, [toast]);
  return <ToastContext.Provider value={{ showToast }}>{children}{toast && <div className={`toast toast-${toast.tone}`} role="status"><span>{toast.tone === "error" ? "!" : "✓"}</span>{toast.message}</div>}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
