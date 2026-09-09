type EmptyStateProps = { title: string; description: string; actionLabel?: string; onAction?: () => void };
export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return <div className="empty-state"><div className="empty-state-icon">⌕</div><h3>{title}</h3><p>{description}</p>{actionLabel && onAction && <button className="primary-button compact" onClick={onAction}>{actionLabel}</button>}</div>;
}
