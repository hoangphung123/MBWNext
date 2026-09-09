import { ReactNode, useEffect } from "react";
type ModalProps = { isOpen: boolean; title: string; children: ReactNode; onClose: () => void; wide?: boolean };

export function Modal({ isOpen, title, children, onClose, wide = false }: ModalProps) {
  useEffect(() => { if (!isOpen) return; const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose(); window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, [isOpen, onClose]);
  if (!isOpen) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className={`modal${wide ? " modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Đóng">×</button></div>{children}</section></div>;
}
