import type { PropsWithChildren, ReactNode } from "react";

import { useAuth } from "../contexts/AuthContext";

export interface CanProps extends PropsWithChildren {
  permission?: string;
  anyOf?: string[];
  fallback?: ReactNode;
}

export function Can({ permission, anyOf, fallback = null, children }: CanProps) {
  const { hasAnyPermission, hasPermission } = useAuth();

  const isAllowed =
    typeof permission === "string"
      ? hasPermission(permission)
      : Array.isArray(anyOf) && anyOf.length > 0
        ? hasAnyPermission(...anyOf)
        : true;

  return isAllowed ? <>{children}</> : <>{fallback}</>;
}
