import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminUser,
  getAdminUsers,
  updateAdminUser,
  updateAdminUserStatus,
} from "../../services/adminAccessRolesService";
import type { ApiAdminManagedUser, ApiAdminRole } from "../../types/api";
import { getAdminErrorMessage } from "../../utils/admin";

export function AccessRolesPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<ApiAdminManagedUser | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [values, setValues] = useState({
    email: "",
    full_name: "",
    role: "editor" as ApiAdminRole,
    is_active: true,
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => getAdminUsers({ page: 1, limit: 50 }),
  });

  useEffect(() => {
    if (!selectedUser) {
      setValues({
        email: "",
        full_name: "",
        role: "editor",
        is_active: true,
      });
      return;
    }

    setValues({
      email: selectedUser.email,
      full_name: selectedUser.full_name ?? "",
      role: selectedUser.role ?? "editor",
      is_active: selectedUser.is_active,
    });
  }, [selectedUser]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (selectedUser) {
        return updateAdminUser(selectedUser.id, values);
      }

      return createAdminUser(values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setMessage({ tone: "success", text: selectedUser ? "User updated." : "User created." });
      setSelectedUser(null);
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to save admin user.") });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateAdminUserStatus(id, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to update user status.") });
    },
  });

  if (usersQuery.isPending) {
    return <LoadingSpinner label="Loading access roles..." />;
  }

  if (usersQuery.error || !usersQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load access roles."
        detail="Check that the admin users and roles endpoints are available."
      />
    );
  }

  return (
    <div className="admin-grid">
      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <h2>Admin Users</h2>
            <p>Admins have full access. Editors cannot archive or manage settings.</p>
          </div>
        </div>
        <div className="admin-card__body">
          {usersQuery.data.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.data.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.full_name ?? user.email}</strong>
                        <p>{user.email}</p>
                      </td>
                      <td>{user.role ?? "editor"}</td>
                      <td>
                        <span className={user.is_active ? "admin-status admin-status--published" : "admin-status admin-status--danger"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() => setSelectedUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-secondary-button"
                            type="button"
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: user.id,
                                isActive: !user.is_active,
                              })
                            }
                          >
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AdminEmptyState
              title="No admin users yet"
              description="Create the first editor or administrator from this workspace."
            />
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <h2>{selectedUser ? "Edit User" : "Create User"}</h2>
            <p>Editors can publish and unpublish, but only admins can archive or manage settings.</p>
          </div>
        </div>
        <div className="admin-card__body">
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              setMessage(null);
              saveMutation.mutate();
            }}
          >
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label htmlFor="access-email">Email</label>
                <input
                  id="access-email"
                  type="email"
                  value={values.email}
                  onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor="access-name">Full Name</label>
                <input
                  id="access-name"
                  type="text"
                  value={values.full_name}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, full_name: event.target.value }))
                  }
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor="access-role">Role</label>
                <select
                  id="access-role"
                  value={values.role}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, role: event.target.value as ApiAdminRole }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className="admin-form__field">
                <label htmlFor="access-status">Status</label>
                <select
                  id="access-status"
                  value={values.is_active ? "true" : "false"}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, is_active: event.target.value === "true" }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            {message ? <AdminFormBanner tone={message.tone} message={message.text} /> : null}

            <div className="admin-form__actions">
              {selectedUser ? (
                <button
                  className="admin-form__cancel"
                  type="button"
                  onClick={() => setSelectedUser(null)}
                >
                  Clear
                </button>
              ) : null}
              <button className="admin-form__submit" type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : selectedUser ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
