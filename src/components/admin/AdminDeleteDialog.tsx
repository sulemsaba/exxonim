interface AdminDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AdminDeleteDialog({
  open,
  title,
  description,
  isPending = false,
  onCancel,
  onConfirm,
}: AdminDeleteDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="admin-form__actions">
          <button className="admin-form__cancel" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="admin-danger-button"
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
