import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminNavigationItem,
  deleteAdminNavigationItem,
  getAdminNavigation,
  updateAdminNavigationItem,
} from "../../services/adminNavigationService";
import {
  flattenNavigationItems,
  getContentStatus,
  getAdminErrorMessage,
} from "../../utils/admin";
import type { ApiNavigationItem } from "../../types/api";

const contentStatusSchema = z.enum(["draft", "pending_review", "published", "rejected", "archived"]);

const navigationSchema = z.object({
  title: z.string().min(1, "Title is required."),
  url: z.string().min(1, "URL is required."),
  description: z.string().optional(),
  kind: z.string().min(1, "Kind is required."),
  parent_id: z.string().optional(),
  order: z
    .string()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), "Order must be an integer."),
  status: contentStatusSchema,
});

type NavigationFormValues = z.infer<typeof navigationSchema>;

const defaultValues: NavigationFormValues = {
  title: "",
  url: "",
  description: "",
  kind: "link",
  parent_id: "",
  order: "0",
  status: "published",
};

function toPayload(values: NavigationFormValues) {
  return {
    title: values.title,
    url: values.url,
    description: values.description || null,
    kind: values.kind,
    parent_id: values.parent_id ? Number(values.parent_id) : null,
    order: values.order ? Number(values.order) : 0,
    status: values.status,
  };
}

function NavigationTree({
  items,
  onEdit,
  onDelete,
}: {
  items: ApiNavigationItem[];
  onEdit: (item: ApiNavigationItem) => void;
  onDelete: (item: ApiNavigationItem) => void;
}) {
  if (!items.length) {
    return (
      <div className="admin-empty">
        <strong>No navigation items yet.</strong>
        <p>Create the first menu item to start the site structure.</p>
      </div>
    );
  }

  return (
    <div className="admin-tree">
      {items.map((item) => (
        <NavigationTreeNode
          key={item.id}
          item={item}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function NavigationTreeNode({
  item,
  depth,
  onEdit,
  onDelete,
}: {
  item: ApiNavigationItem;
  depth: number;
  onEdit: (item: ApiNavigationItem) => void;
  onDelete: (item: ApiNavigationItem) => void;
}) {
  return (
    <>
      <article className={`admin-tree__item admin-tree__item--depth-${Math.min(depth, 2)}`}>
        <div className="admin-toolbar">
          <div>
            <strong>{item.title}</strong>
            <p className="admin-form__hint">
              {item.url} · {item.kind} · order {item.order}
            </p>
          </div>
          <div className="admin-table__actions">
            <button className="admin-table__action" type="button" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button
              className="admin-table__action admin-table__action--danger"
              type="button"
              onClick={() => onDelete(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </article>
      {item.children.map((child) => (
        <NavigationTreeNode
          key={child.id}
          item={child}
          depth={depth + 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

export function NavigationPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiNavigationItem | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const navigationQuery = useQuery({
    queryKey: ["admin", "navigation"],
    queryFn: getAdminNavigation,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NavigationFormValues>({
    resolver: zodResolver(navigationSchema),
    defaultValues,
  });

  const flatItems = flattenNavigationItems(navigationQuery.data ?? []);
  const selectedItem = flatItems.find((item) => item.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminNavigationItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "navigation"] });
      setFormMessage("Navigation item created.");
      setSelectedId(null);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create navigation item."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: NavigationFormValues;
    }) => updateAdminNavigationItem(id, toPayload(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "navigation"] });
      setFormMessage("Navigation item updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update navigation item."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminNavigationItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "navigation"] });
      setDeleteTarget(null);
      setFormMessage("Navigation item deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete navigation item."));
    },
  });

  useEffect(() => {
    if (selectedItem) {
      reset({
        title: selectedItem.title,
        url: selectedItem.url,
        description: selectedItem.description ?? "",
        kind: selectedItem.kind,
        parent_id: selectedItem.parent_id ? String(selectedItem.parent_id) : "",
        order: String(selectedItem.order),
        status: getContentStatus(selectedItem),
      });
      return;
    }

    reset(defaultValues);
  }, [reset, selectedItem]);

  async function onSubmit(values: NavigationFormValues) {
    setFormMessage(null);
    if (selectedItem) {
      await updateMutation.mutateAsync({ id: selectedItem.id, values });
      return;
    }

    await createMutation.mutateAsync(toPayload(values));
  }

  if (navigationQuery.isPending) {
    return <LoadingSpinner label="Loading navigation items..." />;
  }

  if (navigationQuery.error || !navigationQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load navigation."
        detail="Navigation settings could not be loaded right now."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Navigation tree</h2>
              <p>Manage nesting, active states, and sort order for public menu links.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {flatItems.length} navigation items stored
              </span>
              <button
                className="admin-action-button"
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setFormMessage(null);
                  reset(defaultValues);
                }}
              >
                New Navigation Item
              </button>
            </div>

            <NavigationTree
              items={navigationQuery.data}
              onEdit={(item) => {
                setSelectedId(item.id);
                setFormMessage(null);
              }}
              onDelete={(item) => setDeleteTarget(item)}
            />
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>{selectedItem ? "Edit navigation item" : "Create navigation item"}</h2>
              <p>Use the parent selector to create nested menu groups and child links.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="nav-title">Title</label>
                  <input id="nav-title" type="text" {...register("title")} />
                  {errors.title ? (
                    <p className="admin-form__error">{errors.title.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="nav-url">URL</label>
                  <input id="nav-url" type="text" {...register("url")} />
                  {errors.url ? (
                    <p className="admin-form__error">{errors.url.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="nav-kind">Kind</label>
                  <select id="nav-kind" {...register("kind")}>
                    <option value="link">Link</option>
                    <option value="group">Group</option>
                  </select>
                </div>

                <div className="admin-form__field">
                  <label htmlFor="nav-parent">Parent</label>
                  <select id="nav-parent" {...register("parent_id")}>
                    <option value="">No parent</option>
                    {flatItems
                      .filter((item) => item.id !== selectedItem?.id)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {"- ".repeat(item.depth)}
                          {item.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="admin-form__field">
                  <label htmlFor="nav-order">Order</label>
                  <input id="nav-order" type="text" {...register("order")} />
                  {errors.order ? (
                    <p className="admin-form__error">{errors.order.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="nav-status">Status</label>
                  <select id="nav-status" {...register("status")}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="nav-description">Description</label>
                  <textarea id="nav-description" rows={5} {...register("description")} />
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedItem ? (
                  <button
                    className="admin-form__cancel"
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setFormMessage(null);
                      reset(defaultValues);
                    }}
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  className="admin-form__submit"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : selectedItem
                      ? "Update Navigation"
                      : "Create Navigation"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete navigation item?"
        description={`This will remove ${deleteTarget?.title ?? "the selected item"} and any children attached to it.`}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </>
  );
}
