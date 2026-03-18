import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminTestimonial,
  deleteAdminTestimonial,
  getAdminTestimonials,
  updateAdminTestimonial,
} from "../../services/adminTestimonialService";
import { getContentStatus, getAdminErrorMessage } from "../../utils/admin";
import type { ApiContentStatus, ApiTestimonial } from "../../types/api";

const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const testimonialSchema = z.object({
  eyebrow: z.string().optional(),
  headline: z.string().optional(),
  support: z.string().optional(),
  author: z.string().min(1, "Author name is required."),
  author_role: z.string().optional(),
  initials: z.string().optional(),
  content: z.string().min(1, "Testimonial content is required."),
  rating: z
    .string()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), "Rating must be an integer."),
  sort_order: z
    .string()
    .optional()
    .refine((value) => !value || Number.isInteger(Number(value)), "Sort order must be an integer."),
  status: contentStatusSchema,
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const defaultValues: TestimonialFormValues = {
  eyebrow: "",
  headline: "",
  support: "",
  author: "",
  author_role: "",
  initials: "",
  content: "",
  rating: "5",
  sort_order: "0",
  status: "published",
};

function toPayload(values: TestimonialFormValues) {
  return {
    eyebrow: values.eyebrow || null,
    headline: values.headline || null,
    support: values.support || null,
    author: values.author,
    author_role: values.author_role || null,
    initials: values.initials || null,
    content: values.content,
    rating: values.rating ? Number(values.rating) : null,
    sort_order: values.sort_order ? Number(values.sort_order) : 0,
    status: values.status,
  };
}

function getStatusClassName(status: ApiContentStatus) {
  if (status === "published") {
    return "admin-status admin-status--published";
  }

  if (status === "archived") {
    return "admin-status admin-status--danger";
  }

  return "admin-status admin-status--draft";
}

export function TestimonialsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiTestimonial | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const testimonialsQuery = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: getAdminTestimonials,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues,
  });

  const selectedTestimonial =
    testimonialsQuery.data?.find((testimonial) => testimonial.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminTestimonial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      setFormMessage("Testimonial created.");
      setSelectedId(null);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create testimonial."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: TestimonialFormValues;
    }) => updateAdminTestimonial(id, toPayload(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      setFormMessage("Testimonial updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update testimonial."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminTestimonial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      setDeleteTarget(null);
      setFormMessage("Testimonial deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete testimonial."));
    },
  });

  useEffect(() => {
    if (selectedTestimonial) {
      reset({
        eyebrow: selectedTestimonial.eyebrow ?? "",
        headline: selectedTestimonial.headline ?? "",
        support: selectedTestimonial.support ?? "",
        author: selectedTestimonial.author,
        author_role: selectedTestimonial.author_role ?? "",
        initials: selectedTestimonial.initials ?? "",
        content: selectedTestimonial.content,
        rating:
          selectedTestimonial.rating === null || selectedTestimonial.rating === undefined
            ? ""
            : String(selectedTestimonial.rating),
        sort_order: String(selectedTestimonial.sort_order),
        status: getContentStatus(selectedTestimonial),
      });
      return;
    }

    reset(defaultValues);
  }, [reset, selectedTestimonial]);

  async function onSubmit(values: TestimonialFormValues) {
    setFormMessage(null);
    if (selectedTestimonial) {
      await updateMutation.mutateAsync({ id: selectedTestimonial.id, values });
      return;
    }

    await createMutation.mutateAsync(toPayload(values));
  }

  if (testimonialsQuery.isPending) {
    return <LoadingSpinner label="Loading testimonials..." />;
  }

  if (testimonialsQuery.error || !testimonialsQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load testimonials."
        detail="Check that the admin testimonial endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Testimonials</h2>
              <p>Manage testimonial copy, speaker metadata, and display status.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {testimonialsQuery.data.length} testimonials stored
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
                New Testimonial
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Headline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonialsQuery.data.map((testimonial) => (
                    <tr key={testimonial.id}>
                      <td>
                        <strong>{testimonial.author}</strong>
                        <p>{testimonial.author_role ?? "No role provided."}</p>
                      </td>
                      <td>
                        <strong>{testimonial.headline ?? "No headline"}</strong>
                        <p>{testimonial.content}</p>
                      </td>
                      <td>
                        <span className={getStatusClassName(getContentStatus(testimonial))}>
                          {getContentStatus(testimonial)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() => {
                              setSelectedId(testimonial.id);
                              setFormMessage(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-table__action admin-table__action--danger"
                            type="button"
                            onClick={() => setDeleteTarget(testimonial)}
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
              <h2>{selectedTestimonial ? "Edit testimonial" : "Create testimonial"}</h2>
              <p>Keep the quote concise and attach the visible attribution data.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="testimonial-author">Author</label>
                  <input id="testimonial-author" type="text" {...register("author")} />
                  {errors.author ? (
                    <p className="admin-form__error">{errors.author.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-role">Author role</label>
                  <input id="testimonial-role" type="text" {...register("author_role")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-eyebrow">Eyebrow</label>
                  <input id="testimonial-eyebrow" type="text" {...register("eyebrow")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-headline">Headline</label>
                  <input id="testimonial-headline" type="text" {...register("headline")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-initials">Initials</label>
                  <input id="testimonial-initials" type="text" {...register("initials")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-rating">Rating</label>
                  <input id="testimonial-rating" type="text" {...register("rating")} />
                  {errors.rating ? (
                    <p className="admin-form__error">{errors.rating.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-order">Sort order</label>
                  <input id="testimonial-order" type="text" {...register("sort_order")} />
                  {errors.sort_order ? (
                    <p className="admin-form__error">{errors.sort_order.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="testimonial-status">Status</label>
                  <select id="testimonial-status" {...register("status")}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="testimonial-support">Support copy</label>
                  <textarea id="testimonial-support" rows={4} {...register("support")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="testimonial-content">Quote</label>
                  <textarea id="testimonial-content" rows={7} {...register("content")} />
                  {errors.content ? (
                    <p className="admin-form__error">{errors.content.message}</p>
                  ) : null}
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedTestimonial ? (
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
                    : selectedTestimonial
                      ? "Update Testimonial"
                      : "Create Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete testimonial?"
        description={`This will permanently remove the testimonial from ${deleteTarget?.author ?? "the selected author"}.`}
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
