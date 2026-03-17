import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminPricingPlan,
  deleteAdminPricingPlan,
  getAdminPricingPlans,
  updateAdminPricingPlan,
} from "../../services/adminPricingService";
import {
  getAdminErrorMessage,
  parseJsonValue,
  prettyJson,
  tryParseJsonValue,
} from "../../utils/admin";
import type { ApiPricingPlan } from "../../types/api";

const pricingSchema = z.object({
  name: z.string().min(1, "Name is required."),
  badge: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  price: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), "Price must be numeric."),
  features_json: z
    .string()
    .min(2, "Features JSON is required.")
    .refine(
      (value) => Array.isArray(tryParseJsonValue(value)),
      "Features must be a JSON array."
    ),
  recommended: z.boolean(),
  sort_order: z
    .string()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), "Sort order must be an integer."),
  is_active: z.boolean(),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

const defaultValues: PricingFormValues = {
  name: "",
  badge: "",
  description: "",
  notes: "",
  price: "",
  features_json: prettyJson([]),
  recommended: false,
  sort_order: "0",
  is_active: true,
};

function toPayload(values: PricingFormValues) {
  return {
    name: values.name,
    badge: values.badge || null,
    description: values.description || null,
    notes: values.notes || null,
    price: values.price ? Number(values.price) : null,
    features: parseJsonValue<Array<{ label: string; included: boolean }>>(
      values.features_json
    ),
    recommended: values.recommended,
    sort_order: values.sort_order ? Number(values.sort_order) : 0,
    is_active: values.is_active,
  };
}

export function PricingPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiPricingPlan | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const pricingQuery = useQuery({
    queryKey: ["admin", "pricing"],
    queryFn: getAdminPricingPlans,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues,
  });

  const selectedPlan =
    pricingQuery.data?.find((plan) => plan.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminPricingPlan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
      setFormMessage("Pricing plan created.");
      setSelectedId(null);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create pricing plan."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: PricingFormValues;
    }) => updateAdminPricingPlan(id, toPayload(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
      setFormMessage("Pricing plan updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update pricing plan."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPricingPlan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
      setDeleteTarget(null);
      setFormMessage("Pricing plan deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete pricing plan."));
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      reset({
        name: selectedPlan.name,
        badge: selectedPlan.badge ?? "",
        description: selectedPlan.description ?? "",
        notes: selectedPlan.notes ?? "",
        price:
          selectedPlan.price === null || selectedPlan.price === undefined
            ? ""
            : String(selectedPlan.price),
        features_json: prettyJson(selectedPlan.features ?? []),
        recommended: selectedPlan.recommended,
        sort_order: String(selectedPlan.sort_order),
        is_active: selectedPlan.is_active,
      });
      return;
    }

    reset(defaultValues);
  }, [reset, selectedPlan]);

  async function onSubmit(values: PricingFormValues) {
    setFormMessage(null);
    if (selectedPlan) {
      await updateMutation.mutateAsync({ id: selectedPlan.id, values });
      return;
    }

    await createMutation.mutateAsync(toPayload(values));
  }

  if (pricingQuery.isPending) {
    return <LoadingSpinner label="Loading pricing plans..." />;
  }

  if (pricingQuery.error || !pricingQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load pricing plans."
        detail="Check that the admin pricing endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Pricing plans</h2>
              <p>Manage the list of plans shown on the public services page.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {pricingQuery.data.length} plans stored
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
                New Plan
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingQuery.data.map((plan) => (
                    <tr key={plan.id}>
                      <td>
                        <strong>{plan.name}</strong>
                        <p>{plan.description ?? "No description provided."}</p>
                      </td>
                      <td>{plan.price ?? "No price"}</td>
                      <td>
                        <span
                          className={
                            plan.is_active
                              ? "admin-status admin-status--active"
                              : "admin-status admin-status--inactive"
                          }
                        >
                          {plan.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() => {
                              setSelectedId(plan.id);
                              setFormMessage(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-table__action admin-table__action--danger"
                            type="button"
                            onClick={() => setDeleteTarget(plan)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>{selectedPlan ? "Edit pricing plan" : "Create pricing plan"}</h2>
              <p>{"Features are stored as JSON arrays of `{ label, included }` objects."}</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="pricing-name">Name</label>
                  <input id="pricing-name" type="text" {...register("name")} />
                  {errors.name ? (
                    <p className="admin-form__error">{errors.name.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="pricing-badge">Badge</label>
                  <input id="pricing-badge" type="text" {...register("badge")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="pricing-price">Price</label>
                  <input id="pricing-price" type="text" {...register("price")} />
                  {errors.price ? (
                    <p className="admin-form__error">{errors.price.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="pricing-order">Sort Order</label>
                  <input id="pricing-order" type="text" {...register("sort_order")} />
                  {errors.sort_order ? (
                    <p className="admin-form__error">{errors.sort_order.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="pricing-description">Description</label>
                  <textarea
                    id="pricing-description"
                    rows={4}
                    {...register("description")}
                  />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="pricing-notes">Notes</label>
                  <textarea id="pricing-notes" rows={4} {...register("notes")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="pricing-features">Features JSON</label>
                  <textarea
                    id="pricing-features"
                    rows={10}
                    {...register("features_json")}
                  />
                  {errors.features_json ? (
                    <p className="admin-form__error">{errors.features_json.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <span>Recommended</span>
                  <label className="admin-form__checkbox">
                    <input type="checkbox" {...register("recommended")} />
                    Mark this plan as recommended
                  </label>
                </div>

                <div className="admin-form__field">
                  <span>Active</span>
                  <label className="admin-form__checkbox">
                    <input type="checkbox" {...register("is_active")} />
                    Display this plan on the site
                  </label>
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedPlan ? (
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
                    : selectedPlan
                      ? "Update Plan"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete pricing plan?"
        description={`This will permanently remove ${deleteTarget?.name ?? "the selected plan"}.`}
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
