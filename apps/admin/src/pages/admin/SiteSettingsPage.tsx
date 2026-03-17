import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminSiteSetting,
  deleteAdminSiteSetting,
  getAdminSiteSettings,
  updateAdminSiteSetting,
} from "../../services/adminSiteSettingsService";
import {
  getAdminErrorMessage,
  parseJsonValue,
  prettyJson,
  tryParseJsonValue,
} from "../../utils/admin";
import type { ApiSiteSetting } from "../../types/api";

const siteSettingSchema = z.object({
  key: z.string().min(1, "Key is required."),
  value_json: z
    .string()
    .min(2, "Value JSON is required.")
    .refine(
      (value) => typeof tryParseJsonValue(value) !== "undefined",
      "Value must be valid JSON."
    ),
});

type SiteSettingFormValues = z.infer<typeof siteSettingSchema>;

const defaultValues: SiteSettingFormValues = {
  key: "",
  value_json: prettyJson({}),
};

export function SiteSettingsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiSiteSetting | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const settingsQuery = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: getAdminSiteSettings,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteSettingFormValues>({
    resolver: zodResolver(siteSettingSchema),
    defaultValues,
  });

  const selectedSetting =
    settingsQuery.data?.find((setting) => setting.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminSiteSetting,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", variables.key] });
      setFormMessage("Site setting created.");
      setSelectedId(null);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create site setting."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: SiteSettingFormValues;
    }) =>
      updateAdminSiteSetting(id, {
        key: values.key,
        value: parseJsonValue(values.value_json),
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["site-settings", variables.values.key] });
      setFormMessage("Site setting updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update site setting."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminSiteSetting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      setDeleteTarget(null);
      setFormMessage("Site setting deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete site setting."));
    },
  });

  useEffect(() => {
    if (selectedSetting) {
      reset({
        key: selectedSetting.key,
        value_json: prettyJson(selectedSetting.value),
      });
      return;
    }

    reset(defaultValues);
  }, [reset, selectedSetting]);

  async function onSubmit(values: SiteSettingFormValues) {
    setFormMessage(null);
    if (selectedSetting) {
      await updateMutation.mutateAsync({ id: selectedSetting.id, values });
      return;
    }

    await createMutation.mutateAsync({
      key: values.key,
      value: parseJsonValue(values.value_json),
    });
  }

  if (settingsQuery.isPending) {
    return <LoadingSpinner label="Loading site settings..." />;
  }

  if (settingsQuery.error || !settingsQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load site settings."
        detail="Check that the admin site settings endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Global settings</h2>
              <p>These JSON values drive company info, footer links, and public content helpers.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {settingsQuery.data.length} settings stored
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
                New Setting
              </button>
            </div>

            <div className="admin-list-grid">
              {settingsQuery.data.map((setting) => (
                <article key={setting.id} className="admin-card">
                  <div className="admin-card__body">
                    <div className="admin-toolbar">
                      <div>
                        <strong>{setting.key}</strong>
                        <p className="admin-form__hint">
                          Last updated {new Date(setting.updated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="admin-table__actions">
                        <button
                          className="admin-table__action"
                          type="button"
                          onClick={() => {
                            setSelectedId(setting.id);
                            setFormMessage(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-table__action admin-table__action--danger"
                          type="button"
                          onClick={() => setDeleteTarget(setting)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <pre>{prettyJson(setting.value)}</pre>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>{selectedSetting ? "Edit site setting" : "Create site setting"}</h2>
              <p>Values are stored as raw JSON and consumed directly by the public frontend.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="site-setting-key">Setting key</label>
                  <input id="site-setting-key" type="text" {...register("key")} />
                  {errors.key ? (
                    <p className="admin-form__error">{errors.key.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="site-setting-value">Value JSON</label>
                  <textarea
                    id="site-setting-value"
                    rows={16}
                    {...register("value_json")}
                  />
                  {errors.value_json ? (
                    <p className="admin-form__error">{errors.value_json.message}</p>
                  ) : null}
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedSetting ? (
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
                    : selectedSetting
                      ? "Update Setting"
                      : "Create Setting"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete site setting?"
        description={`This will permanently remove ${deleteTarget?.key ?? "the selected setting"}.`}
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
