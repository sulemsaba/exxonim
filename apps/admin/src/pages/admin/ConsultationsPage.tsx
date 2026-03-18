import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  getAdminConsultation,
  getAdminConsultations,
  getAdminStaff,
  notifyAdminConsultation,
  updateAdminConsultation,
  type AdminConsultationListParams,
  type AdminConsultationNotifyPayload,
  type AdminConsultationUpdatePayload,
} from "../../services/adminConsultationService";
import type {
  ApiConsultationAdminListItem,
  ApiConsultationStatus,
  ApiNotificationType,
} from "../../types/api";
import { getAdminErrorMessage } from "../../utils/admin";

const consultationPageStyles = String.raw`
  .consultation-history {
    display: grid;
    gap: 0.9rem;
  }

  .consultation-history__item {
    position: relative;
    padding-left: 1.2rem;
  }

  .consultation-history__item::before {
    content: "";
    position: absolute;
    top: 0.4rem;
    left: 0;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 999px;
    background: var(--color-accent);
    box-shadow: 0 0 0 0.22rem rgba(15, 92, 99, 0.1);
  }

  .consultation-history__item strong,
  .consultation-detail__section strong {
    display: block;
  }

  .consultation-detail__meta {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .consultation-detail__meta > div {
    padding: 0.95rem 1rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.58);
  }

  .consultation-detail__section {
    display: grid;
    gap: 0.5rem;
  }

  .consultation-detail__section p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  @media (max-width: 720px) {
    .consultation-detail__meta {
      grid-template-columns: 1fr;
    }
  }
`;

const consultationStatuses: ApiConsultationStatus[] = [
  "pending",
  "contacted",
  "completed",
  "cancelled",
];

function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString();
}

function renderStatus(status: ApiConsultationStatus) {
  const className =
    status === "completed" || status === "contacted"
      ? "admin-status admin-status--published"
      : status === "cancelled"
        ? "admin-status admin-status--inactive"
        : "admin-status admin-status--draft";

  return <span className={className}>{status}</span>;
}

export function ConsultationsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AdminConsultationListParams>({
    page: 1,
    limit: 20,
    status: "",
    assigned_to: "",
    search: "",
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    status: ApiConsultationStatus;
    assigned_to: string;
    notes: string;
    public_notes: string;
    status_comment: string;
  }>({
    status: "pending",
    assigned_to: "",
    notes: "",
    public_notes: "",
    status_comment: "",
  });
  const [notificationValues, setNotificationValues] = useState<{
    type: ApiNotificationType;
    subject: string;
    message: string;
  }>({
    type: "email",
    subject: "",
    message: "",
  });

  const consultationsQuery = useQuery({
    queryKey: ["admin", "consultations", filters],
    queryFn: () => getAdminConsultations(filters),
  });

  const staffQuery = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: getAdminStaff,
  });

  const selectedItem: ApiConsultationAdminListItem | null =
    consultationsQuery.data?.items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId && consultationsQuery.data?.items.length) {
      setSelectedId(consultationsQuery.data.items[0].id);
    }
  }, [consultationsQuery.data, selectedId]);

  const detailQuery = useQuery({
    queryKey: ["admin", "consultation", selectedId],
    queryFn: () => getAdminConsultation(selectedId as number),
    enabled: selectedId !== null,
  });

  useEffect(() => {
    if (!detailQuery.data) {
      return;
    }

    setEditValues({
      status: detailQuery.data.status,
      assigned_to: detailQuery.data.assigned_to?.id
        ? String(detailQuery.data.assigned_to.id)
        : "",
      notes: detailQuery.data.notes ?? "",
      public_notes: detailQuery.data.public_notes ?? "",
      status_comment: "",
    });
  }, [detailQuery.data]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AdminConsultationUpdatePayload;
    }) => updateAdminConsultation(id, payload),
    onSuccess: async (data) => {
      setFormMessage("Consultation updated.");
      setSelectedId(data.id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "consultations"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin", "consultation", data.id],
      });
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update consultation."));
    },
  });

  const notifyMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AdminConsultationNotifyPayload;
    }) => notifyAdminConsultation(id, payload),
    onSuccess: async () => {
      setNotifyMessage("Notification queued.");
      setNotificationValues({
        type: "email",
        subject: "",
        message: "",
      });
      if (selectedId) {
        await queryClient.invalidateQueries({
          queryKey: ["admin", "consultation", selectedId],
        });
      }
    },
    onError: (error) => {
      setNotifyMessage(getAdminErrorMessage(error, "Unable to send notification."));
    },
  });

  async function handleUpdateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) {
      return;
    }

    setFormMessage(null);

    await updateMutation.mutateAsync({
      id: selectedId,
      payload: {
        status: editValues.status,
        assigned_to: editValues.assigned_to ? Number(editValues.assigned_to) : null,
        notes: editValues.notes || null,
        public_notes: editValues.public_notes || null,
        status_comment: editValues.status_comment || null,
      },
    });
  }

  async function handleNotifySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) {
      return;
    }

    setNotifyMessage(null);

    await notifyMutation.mutateAsync({
      id: selectedId,
      payload: {
        type: notificationValues.type,
        subject: notificationValues.type === "email" ? notificationValues.subject : null,
        message: notificationValues.message,
      },
    });
  }

  if (consultationsQuery.isPending || staffQuery.isPending) {
    return <LoadingSpinner label="Loading consultations workspace..." />;
  }

  if (consultationsQuery.error || !consultationsQuery.data || staffQuery.error || !staffQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load consultations."
        detail="Check that the consultations endpoints are available."
      />
    );
  }

  return (
    <>
      <style>{consultationPageStyles}</style>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Consultations</h2>
              <p>Track incoming requests, filter by status, and open a consultation to manage it.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {consultationsQuery.data.total} consultations
              </span>
            </div>

            <form className="admin-form" onSubmit={(event) => event.preventDefault()}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="consultation-search">Search</label>
                  <input
                    id="consultation-search"
                    value={filters.search ?? ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        search: event.target.value,
                        page: 1,
                      }))
                    }
                    placeholder="Search by name, email, or tracking ID"
                  />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="consultation-status-filter">Status</label>
                  <select
                    id="consultation-status-filter"
                    value={filters.status ?? ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        status: event.target.value as ApiConsultationStatus | "",
                        page: 1,
                      }))
                    }
                  >
                    <option value="">All statuses</option>
                    {consultationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form__field">
                  <label htmlFor="consultation-assigned-filter">Assigned to</label>
                  <select
                    id="consultation-assigned-filter"
                    value={filters.assigned_to ?? ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        assigned_to: event.target.value ? Number(event.target.value) : "",
                        page: 1,
                      }))
                    }
                  >
                    <option value="">All staff</option>
                    {staffQuery.data.map((staffMember) => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {consultationsQuery.data.items.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tracking ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultationsQuery.data.items.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          background:
                            item.id === selectedId ? "rgba(15, 92, 99, 0.06)" : undefined,
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td>{item.tracking_id}</td>
                        <td>
                          <strong>{item.full_name}</strong>
                          <p>{item.email}</p>
                        </td>
                        <td>{renderStatus(item.status)}</td>
                        <td>{item.assigned_to?.full_name ?? "Unassigned"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty">
                <strong>No consultations match the current filters.</strong>
                <p>New public requests will appear here automatically.</p>
              </div>
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Consultation detail</h2>
              <p>
                {selectedItem
                  ? `Managing ${selectedItem.tracking_id}`
                  : "Select a consultation to edit status, notes, and notifications."}
              </p>
            </div>
          </div>
          <div className="admin-card__body">
            {!selectedId ? (
              <div className="admin-empty">
                <strong>No consultation selected.</strong>
              </div>
            ) : detailQuery.isPending ? (
              <LoadingSpinner label="Loading consultation detail..." />
            ) : detailQuery.error || !detailQuery.data ? (
              <ErrorMessage
                title="Unable to load consultation detail."
                detail="The selected consultation could not be fetched."
              />
            ) : (
              <div className="admin-surface">
                <div className="consultation-detail__meta">
                  <div>
                    <strong>Status</strong>
                    {renderStatus(detailQuery.data.status)}
                  </div>
                  <div>
                    <strong>Tracking ID</strong>
                    <span>{detailQuery.data.tracking_id}</span>
                  </div>
                  <div>
                    <strong>Created</strong>
                    <span>{formatTimestamp(detailQuery.data.created_at)}</span>
                  </div>
                  <div>
                    <strong>Updated</strong>
                    <span>{formatTimestamp(detailQuery.data.updated_at)}</span>
                  </div>
                </div>

                <div className="consultation-detail__section">
                  <strong>Customer</strong>
                  <p>{detailQuery.data.full_name}</p>
                  <p>{detailQuery.data.email}</p>
                  {detailQuery.data.phone ? <p>{detailQuery.data.phone}</p> : null}
                  {detailQuery.data.company ? <p>{detailQuery.data.company}</p> : null}
                </div>

                <div className="consultation-detail__section">
                  <strong>Request</strong>
                  <p>{detailQuery.data.message}</p>
                </div>

                <form className="admin-form" onSubmit={handleUpdateSubmit}>
                  <div className="admin-form__grid">
                    <div className="admin-form__field">
                      <label htmlFor="consultation-status">Status</label>
                      <select
                        id="consultation-status"
                        value={editValues.status}
                        onChange={(event) =>
                          setEditValues((current) => ({
                            ...current,
                            status: event.target.value as ApiConsultationStatus,
                          }))
                        }
                      >
                        {consultationStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form__field">
                      <label htmlFor="consultation-assigned">Assigned to</label>
                      <select
                        id="consultation-assigned"
                        value={editValues.assigned_to}
                        onChange={(event) =>
                          setEditValues((current) => ({
                            ...current,
                            assigned_to: event.target.value,
                          }))
                        }
                      >
                        <option value="">Unassigned</option>
                        {staffQuery.data.map((staffMember) => (
                          <option key={staffMember.id} value={staffMember.id}>
                            {staffMember.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form__field admin-form__field--full">
                      <label htmlFor="consultation-public-notes">Public notes</label>
                      <textarea
                        id="consultation-public-notes"
                        rows={4}
                        value={editValues.public_notes}
                        onChange={(event) =>
                          setEditValues((current) => ({
                            ...current,
                            public_notes: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="admin-form__field admin-form__field--full">
                      <label htmlFor="consultation-notes">Internal notes</label>
                      <textarea
                        id="consultation-notes"
                        rows={5}
                        value={editValues.notes}
                        onChange={(event) =>
                          setEditValues((current) => ({
                            ...current,
                            notes: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="admin-form__field admin-form__field--full">
                      <label htmlFor="consultation-status-comment">
                        Status change comment
                      </label>
                      <textarea
                        id="consultation-status-comment"
                        rows={3}
                        value={editValues.status_comment}
                        onChange={(event) =>
                          setEditValues((current) => ({
                            ...current,
                            status_comment: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

                  <div className="admin-form__actions">
                    <button
                      className="admin-form__submit"
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Saving..." : "Update Consultation"}
                    </button>
                  </div>
                </form>

                <section className="admin-card">
                  <div className="admin-card__header">
                    <div>
                      <h3>Status history</h3>
                      <p>Every status transition is recorded here.</p>
                    </div>
                  </div>
                  <div className="admin-card__body">
                    <div className="consultation-history">
                      {detailQuery.data.status_history.map((item) => (
                        <div key={item.id} className="consultation-history__item">
                          <strong>
                            {item.old_status ? `${item.old_status} -> ` : ""}
                            {item.new_status}
                          </strong>
                          <p>{formatTimestamp(item.changed_at)}</p>
                          {item.comment ? <p>{item.comment}</p> : null}
                          {item.changed_by ? <p>{item.changed_by.full_name}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="admin-card">
                  <div className="admin-card__header">
                    <div>
                      <h3>Manual notification</h3>
                      <p>Send an email or SMS update directly to the customer.</p>
                    </div>
                  </div>
                  <div className="admin-card__body">
                    <form className="admin-form" onSubmit={handleNotifySubmit}>
                      <div className="admin-form__grid">
                        <div className="admin-form__field">
                          <label htmlFor="consultation-notify-type">Type</label>
                          <select
                            id="consultation-notify-type"
                            value={notificationValues.type}
                            onChange={(event) =>
                              setNotificationValues((current) => ({
                                ...current,
                                type: event.target.value as ApiNotificationType,
                              }))
                            }
                          >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                          </select>
                        </div>

                        {notificationValues.type === "email" ? (
                          <div className="admin-form__field">
                            <label htmlFor="consultation-notify-subject">Subject</label>
                            <input
                              id="consultation-notify-subject"
                              value={notificationValues.subject}
                              onChange={(event) =>
                                setNotificationValues((current) => ({
                                  ...current,
                                  subject: event.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        ) : null}

                        <div className="admin-form__field admin-form__field--full">
                          <label htmlFor="consultation-notify-message">Message</label>
                          <textarea
                            id="consultation-notify-message"
                            rows={5}
                            value={notificationValues.message}
                            onChange={(event) =>
                              setNotificationValues((current) => ({
                                ...current,
                                message: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      {notifyMessage ? <p className="admin-form__hint">{notifyMessage}</p> : null}

                      <div className="admin-form__actions">
                        <button
                          className="admin-form__submit"
                          type="submit"
                          disabled={notifyMutation.isPending}
                        >
                          {notifyMutation.isPending ? "Queueing..." : "Send Notification"}
                        </button>
                      </div>
                    </form>
                  </div>
                </section>

                <section className="admin-card">
                  <div className="admin-card__header">
                    <div>
                      <h3>Notification log</h3>
                      <p>Recent automatic and manual notifications for this consultation.</p>
                    </div>
                  </div>
                  <div className="admin-card__body">
                    {detailQuery.data.notification_logs.length ? (
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Recipient</th>
                              <th>Status</th>
                              <th>Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailQuery.data.notification_logs.map((log) => (
                              <tr key={log.id}>
                                <td>{log.type}</td>
                                <td>
                                  <strong>{log.recipient}</strong>
                                  <p>{log.subject ?? "No subject"}</p>
                                </td>
                                <td>{log.status}</td>
                                <td>{formatTimestamp(log.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="admin-empty">
                        <strong>No notifications yet.</strong>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
