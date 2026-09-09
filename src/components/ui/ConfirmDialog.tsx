import { ReactNode } from "react";
import { Modal } from "./Modal";
type ConfirmDialogProps = { isOpen: boolean; title: string; description: ReactNode; confirmLabel?: string; onConfirm: () => void; onClose: () => void };
export function ConfirmDialog({ isOpen, title, description, confirmLabel = "Xác nhận", onConfirm, onClose }: ConfirmDialogProps) { return <Modal isOpen={isOpen} title={title} onClose={onClose}><div className="confirm-dialog"><p>{description}</p><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Hủy</button><button className="primary-button compact" onClick={onConfirm}>{confirmLabel}</button></div></div></Modal>; }
