import { getAdminStatusTone, type AdminStatusTone } from "../../utils/admin";

interface AdminStatusBadgeProps {
  label: string;
  tone?: AdminStatusTone;
}

export function AdminStatusBadge({ label, tone }: AdminStatusBadgeProps) {
  const resolvedTone = tone ?? getAdminStatusTone(label);

  return <span className={`admin-status admin-status--${resolvedTone}`}>{label}</span>;
}
