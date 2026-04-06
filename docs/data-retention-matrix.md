# Exxonim Data Retention Matrix

This is the operational retention reference for Groups 7 and 8.

Retention must stay aligned with actual system behavior. Do not advertise shorter or broader cleanup than the platform really performs.

| Data set | Storage location | Suggested retention posture | Cleanup mode |
| --- | --- | --- | --- |
| Refresh sessions | PostgreSQL `admin_refresh_sessions` | Keep only while active or until expiry; remove expired sessions regularly | Automated cleanup via `python scripts/prune_expired_refresh_sessions.py` |
| Consent logs | PostgreSQL `privacy_consent_logs` | Keep as an auditable record of consent changes and policy versions | Retained, review manually before changing policy |
| Admin notifications | PostgreSQL `admin_notifications` | Keep until product policy decides archival or pruning rules | Retained for now |
| Audit logs | PostgreSQL `audit_logs` | Keep as append-only governance history | Retained, no blanket auto-delete |
| Service/customer records | PostgreSQL business tables | Keep according to service and legal needs | Retained, reviewed manual handling only |
| Privacy requests | PostgreSQL `privacy_requests` | Keep as auditable evidence of handling | Retained, reviewed manual handling only |
| Backups | Backup artifacts under operator-defined storage | Keep on a documented schedule with named owner and restore expectations | Operator-managed rotation |
| Media | Filesystem / object storage | Keep according to business retention and backup policy | Operator-managed review |

## Notes

- Theme preference remains browser storage only and is not part of the business-record retention model.
- Deletion requests must not silently hard-delete audit-critical history.
- Backup retention and restore drill timing must be recorded in deployment handoff notes for the actual environment.
