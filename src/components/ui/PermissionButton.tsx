import { ButtonHTMLAttributes, ReactNode } from "react";
import { activeRole, can, PermissionAction, PermissionModule } from "../../lib/accessControl";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { module: PermissionModule; action: PermissionAction; children: ReactNode };
export function PermissionButton({ module, action, children, disabled, title, ...props }: Props) { const allowed = can(activeRole(), module, action); return <button {...props} disabled={disabled || !allowed} title={!allowed ? `Role hiện tại không có quyền ${action} tại ${module}.` : title}>{children}</button>; }
